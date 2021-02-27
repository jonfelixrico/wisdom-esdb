import { IQuote } from '@models/quote.interface'

export interface IApprovedQuote extends IQuote {
  approveDt: Date
  approveCause: string
}
