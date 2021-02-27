import { Snowflake } from 'discord.js'

export interface ICommandLocation {
  channel: Snowflake
  guild: Snowflake
  message: Snowflake
}
