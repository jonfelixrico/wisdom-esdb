import { Injectable } from '@nestjs/common'
import { PrefixRepository } from '@discord/models/repositories/prefix-repository.abstract'
import { Client, Message } from 'discord.js'
import { Subject } from 'rxjs'

export interface ICommandBusPayload {
  command: string
  message: Message
}

const PREFIX_REGEXP = /^(\S+)\s+(.+?)\s*$/

@Injectable()
export class PrefixWatcherService {
  private emitter = new Subject<ICommandBusPayload>()

  constructor(private client: Client, private prefixRepo: PrefixRepository) {
    this.initWatcher()
  }

  get commandBus() {
    return this.emitter.asObservable()
  }

  initWatcher() {
    this.client.on('message', async (message) => {
      if (!PREFIX_REGEXP.test(message.content)) {
        return
      }

      /*
       * Check if the content starts with the guild's assigned prefix for the bot.
       * If it matches, extract the command portion (e.g. submit <...params>, receive) and
       * dispatch it in the command bus.
       */

      const [prefix, command] = PREFIX_REGEXP.exec(message.content).slice(1)
      const guildPrefix = await this.prefixRepo.getPrefix(message.guild.id)
      if (prefix !== guildPrefix) {
        return
      }

      this.emitter.next({
        command,
        message,
      })
    })
  }
}
