import { IQuote } from '@models/quote.interface'
import { Snowflake } from 'discord.js'
import { ICommandLocation } from './command-location.interface'

export interface IReceiveBody extends ICommandLocation {
  receiveDt: Date
  receiveBy: Snowflake
}

export interface IReceivedQuote {
  id: string
  quote: IQuote
}
