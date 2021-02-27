import { IQuote } from './quote.interface'

export interface IDroppedQuote extends IQuote {
  dropCause: string
  dropDt: string
}
