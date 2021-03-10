/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common'
import { GuildRepository } from '@repositories/models/guild-repository.abstract'
import { Snowflake } from 'discord.js'

@Injectable()
export class GuildRepositoryImplService extends GuildRepository {
  async getApprovalRequiredCount(guild: string): Promise<number> {
    return 3
  }

  async getApprovalEmoji(guild: Snowflake) {
    return '🤔'
  }

  async getPrefix(guild: Snowflake): Promise<string> {
    return '!wisdom'
  }

  async getDaysForQuoteExpiration(guild: Snowflake): Promise<number> {
    return 7
  }

  async getTimezone(guild: Snowflake): Promise<string> {
    return 'Asia/Manila'
  }
}
