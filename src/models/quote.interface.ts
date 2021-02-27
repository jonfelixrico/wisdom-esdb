import { Snowflake } from 'discord.js'
import { ICommandLocation } from './command-location.interface'

export interface IQuoteBody extends ICommandLocation {
  content: string
  year: number
  author: Snowflake

  // who submitted the quote
  submitBy: Snowflake
  submitDt: Date
}

export interface IQuote extends IQuoteBody {
  id: string
}
