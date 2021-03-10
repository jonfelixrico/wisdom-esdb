import {
  ReactionWatcherService,
  CollectionFinishedEvent,
} from '@discord/services/reaction-watcher/reaction-watcher.service'
import { QuoteInteractorService } from '@interactors/quote-interactor/quote-interactor.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class VerdictWatcherService {
  constructor(
    private quoteInteractor: QuoteInteractorService,
    private reactionWatcher: ReactionWatcherService,
  ) {
    this.reactionWatcher.events$.subscribe(this.handleWatcherEvent.bind(this))
  }

  private async handleExpiration([quote, message]: CollectionFinishedEvent) {
    await this.quoteInteractor.dropQuote(quote.id, 'Expired')

    await message.delete()
    // TODO format message
    await message.channel.send('expired -' + JSON.stringify(quote))
  }

  private async handleApproval([quote, message]: CollectionFinishedEvent) {
    await this.quoteInteractor.approveQuote(quote.id, 'Completed reactions')

    await message.delete()
    // TODO format message
    await message.channel.send('expired -' + JSON.stringify(quote))
  }

  private handleWatcherEvent(event: CollectionFinishedEvent) {
    const status = event.slice[2]

    if (status === 'EXPIRED') {
      this.handleExpiration(event)
    } else {
      this.handleApproval(event)
    }
  }
}
