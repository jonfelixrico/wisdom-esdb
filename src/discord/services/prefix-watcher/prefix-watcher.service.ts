import { Injectable } from '@nestjs/common'
import { PrefixRepository } from '@repositories/models/prefix-repository.abstract'
import { Client, Message } from 'discord.js'
import { Subject } from 'rxjs'
import { matchPrefix } from '@discord/utils/command-utils.util'

export interface ICommandBusPayload {
  command: string
  message: Message
}

@Injectable()
export class PrefixWatcherService {
  private emitter = new Subject<ICommandBusPayload>()

  constructor(private client: Client, private prefixRepo: PrefixRepository) {
    this.onInit()
  }

  get commandBus() {
    return this.emitter.asObservable()
  }

  onInit() {
    this.client.on('message', async (message) => {
      const guildPrefix = await this.prefixRepo.getPrefix(message.guild.id)

      const extractedCommand = matchPrefix(guildPrefix, message.content)
      if (extractedCommand === false) {
        return
      }

      this.emitter.next({
        command: extractedCommand,
        message,
      })
    })
  }
}
