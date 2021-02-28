import { Snowflake } from 'discord.js'

export abstract class PrefixRepository {
  abstract getPrefix(guildId: Snowflake): Promise<string>
}
