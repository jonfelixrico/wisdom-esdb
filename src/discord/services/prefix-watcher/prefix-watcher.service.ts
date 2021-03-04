import { Injectable } from '@nestjs/common'
import { Client, Message } from 'discord.js'
import { Subject } from 'rxjs'
import { matchPrefix } from '@discord/utils/command-utils.util'
import { GuildRepository } from '@repositories/models/guild-repository.abstract'

export interface ICommandBusPayload {
  command: string
  message: Message
}

@Injectable()
export class PrefixWatcherService {
  private emitter = new Subject<ICommandBusPayload>()

  constructor(private client: Client, private guildRepo: GuildRepository) {
    this.onInit()
  }

  get commandBus() {
    return this.emitter.asObservable()
  }

  onInit() {
    this.client.on('message', async (message) => {
      const guildPrefix = await this.guildRepo.getPrefix(message.guild.id)

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
