import { Snowflake } from 'discord.js'

export abstract class GuildRepository {
  abstract getPrefix(guildId: Snowflake): Promise<string>

  abstract getDaysForQuoteExpiration(guildId: Snowflake): Promise<number>

  abstract getTimezone(guildId: string): Promise<string>
}
