import { IQuote } from './quote.interface'

export interface IPendingQuote extends IQuote {
  expireDt: Date
}
