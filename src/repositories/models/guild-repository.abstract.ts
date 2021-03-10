import { Snowflake } from 'discord.js'

export abstract class GuildRepository {
  abstract getPrefix(guild: Snowflake): Promise<string>

  abstract getDaysForQuoteExpiration(guild: Snowflake): Promise<number>

  abstract getTimezone(guild: Snowflake): Promise<string>

  abstract getApprovalEmoji(guild: Snowflake): Promise<string>
}
