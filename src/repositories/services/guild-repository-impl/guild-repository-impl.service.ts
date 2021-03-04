/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common'
import { GuildRepository } from '@repositories/models/guild-repository.abstract'

@Injectable()
export class GuildRepositoryImplService extends GuildRepository {
  async getPrefix(guildId: string): Promise<string> {
    return '!wisdom'
  }

  async getDaysForQuoteExpiration(guildId: string): Promise<number> {
    return 7
  }

  async getTimezone(guildId: string): Promise<string> {
    return 'Asia/Manila'
  }
}
