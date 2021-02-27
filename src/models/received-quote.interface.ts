import { IQuote } from '@models/quote.interface'
import { Snowflake } from 'discord.js'

export interface IReceiveBody {
  receiveDt: Date
  receiveBy: Snowflake

  channel: Snowflake
  guild: Snowflake
  message: Snowflake
}

export interface IReceivedQuote {
  id: string
  quote: IQuote
}
