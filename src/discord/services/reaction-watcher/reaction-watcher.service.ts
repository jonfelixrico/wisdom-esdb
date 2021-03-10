import { Injectable } from '@nestjs/common'
import { Client, Message } from 'discord.js'
import { race, Subject, timer } from 'rxjs'
import { take, filter, mapTo } from 'rxjs/operators'
import {
  ReactionFilter,
  ReactionPair,
  watchReactions,
} from '@discord/utils/discord-reaction.util'
import { GuildRepository } from '@repositories/models/guild-repository.abstract'
import { finalize } from 'rxjs/operators'
import { IPendingQuote } from '@models/pending-quote.interface'

type Status = 'EXPIRED' | 'COMPLETED'
export type CollectionFinishedEvent = [IPendingQuote, Message, Status]

@Injectable()
export class ReactionWatcherService {
  private emitter = new Subject<CollectionFinishedEvent>()

  constructor(private client: Client, private guildRepo: GuildRepository) {}

  private get clientId() {
    return this.client.user.id
  }

  private emit(quote: IPendingQuote, message: Message, status: Status) {
    this.emitter.next([quote, message, status])
  }

  async watch(message: Message, pendingQuote: IPendingQuote) {
    const { expireDt, guild } = pendingQuote

    const millisToExpireDt = expireDt.getTime() - Date.now()

    /*
     * A negative value means that the current date has passed the expiration date.
     * No need to watch for reactions if the quote/message to watch has already expired.
     */
    if (millisToExpireDt <= 0) {
      this.emit(pendingQuote, message, 'EXPIRED')
      return
    }

    const approvalEmoji = await this.guildRepo.getApprovalEmoji(guild)
    const requiredCount = await this.guildRepo.getApprovalRequiredCount(guild)

    const { clientId } = this

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const filterFn: ReactionFilter = (reaction, user) =>
      reaction.emoji.name === approvalEmoji &&
      /*
       * This is to not count the first reaction made by the bot on the message.
       * The first reaction by the bot was to make approval reactions easier for the users.
       */
      user.id !== clientId

    const expire$ = timer(millisToExpireDt).pipe(
      mapTo<number, Status>('EXPIRED'),
    )

    const { observable, stop } = watchReactions(message, filterFn)

    const reactions$ = observable.pipe(
      /*
       * These two operations below will make the observable only emit if the required reactions
       * for the message has been reached.
       */
      filter((emitted) => {
        const pair = emitted.find(([emoji]) => emoji.name === approvalEmoji)
        return pair && pair[1] >= requiredCount
      }),
      take(1),

      mapTo<ReactionPair[], Status>('COMPLETED'),
    )

    /*
     * If expire$ emits first, then that means that the submission has expired.
     * If reactions$ emits first, then that menas that the submission has garnered enough votes
     * for approval.
     *
     * Watching for reactions will stop once one of those observables emit.
     */
    race(expire$, reactions$)
      .pipe(finalize(() => stop()))
      .subscribe((status) => this.emit(pendingQuote, message, status))
  }
}
