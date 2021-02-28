import { PrefixWatcherService } from '@discord/services/prefix-watcher/prefix-watcher.service'
import { ReceiveInteractorService } from '@interactors/receive-interactor/receive-interactor.service'
import { Injectable } from '@nestjs/common'
import { filter } from 'rxjs/operators'
import { ICommandBusPayload } from '@discord/services/prefix-watcher/prefix-watcher.service'

const RECEIVE_COMMAND_PREFIX = 'receive'

@Injectable()
export class ReceiveWatcherService {
  constructor(
    private receiveInteractor: ReceiveInteractorService,
    private watcher: PrefixWatcherService,
  ) {
    this.listenToCommandBus()
  }

  async handler({ message }: ICommandBusPayload) {
    await message.react('🌬️')
    const response = await message.channel.send('🤔')

    const received = await this.receiveInteractor.receiveQuote({
      channel: message.channel.id,
      guild: message.guild.id,
      message: response.id,

      receiveBy: message.author.id,
      receiveDt: new Date(),
    })

    await response.edit(JSON.stringify(received))
  }

  get commandBus$() {
    return this.watcher.commandBus.pipe(
      filter(({ command }) => command === RECEIVE_COMMAND_PREFIX),
    )
  }

  listenToCommandBus() {
    const { commandBus$: commandCall$, handler } = this
    commandCall$.subscribe(handler.bind(this))
  }
}
