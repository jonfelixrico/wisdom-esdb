import { Snowflake } from 'discord.js'

export interface IQuote {
  id: string

  content: string
  year: number
  author: Snowflake

  // who submitted the quote
  submitBy: Snowflake
  submitDt: Date

  // where the quote was submitted
  channel: Snowflake
  guild: Snowflake
  message: Snowflake
}
