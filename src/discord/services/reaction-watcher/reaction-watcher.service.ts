import { Injectable } from '@nestjs/common'
import { Client, Message } from 'discord.js'
import { IPendingQuote } from '@models/pending-quote.interface'
import { race, Subject, timer } from 'rxjs'
import { take, filter, mapTo } from 'rxjs/operators'
import {
  ReactionFilter,
  ReactionPair,
  watchReactions,
} from '@discord/utils/discord-reaction.util'
import { GuildRepository } from '@repositories/models/guild-repository.abstract'
import { finalize } from 'rxjs/operators'

export type CollectionStatus = 'EXPIRED' | 'COMPLETED'

@Injectable()
export class ReactionWatcherService {
  private emitter = new Subject<[string, CollectionStatus]>()

  constructor(private client: Client, private guildRepo: GuildRepository) {}

  private get clientId() {
    return this.client.user.id
  }

  private emit(id: string, status: CollectionStatus) {
    this.emitter.next([id, status])
  }

  async watch(message: Message, pendingQuote: IPendingQuote) {
    const { expireDt, id, guild } = pendingQuote

    const millisToExpireDt = Date.now() - expireDt.getTime()

    if (millisToExpireDt <= 0) {
      this.emit(pendingQuote.id, 'EXPIRED')
      return
    }

    const approvalEmoji = await this.guildRepo.getApprovalEmoji(guild)
    const requiredCount = await this.guildRepo.getApprovalRequiredCount(guild)

    const { clientId } = this
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const filterFn: ReactionFilter = (reaction, user) =>
      reaction.emoji.name === approvalEmoji && user.id !== clientId

    const expire$ = timer(millisToExpireDt).pipe(
      mapTo<number, CollectionStatus>('EXPIRED'),
    )
    const { observable, stop } = watchReactions(message, filterFn)

    const reactions$ = observable.pipe(
      filter((emitted) => {
        const pair = emitted.find(([emoji]) => emoji.name === approvalEmoji)
        return pair && pair[1] >= requiredCount
      }),
      mapTo<ReactionPair[], CollectionStatus>('COMPLETED'),
      take(1),
    )

    race(expire$, reactions$)
      .pipe(finalize(() => stop()))
      .subscribe((status) => this.emit(id, status))
  }
}
