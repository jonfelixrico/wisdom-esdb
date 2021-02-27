import { Snowflake } from 'discord.js'

export interface IQuoteBody {
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

export interface IQuote extends IQuoteBody {
  id: string
}
