import { IPendingQuote } from '@models/pending-quote.interface'
import { IApprovedQuote } from '@models/approved-quote.interface'
import { IDroppedQuote } from '@models/dropped-quote.interface'

export interface ApproveQuoteOutput {
  approveDt: Date
  cause: string
  quoteId: string
}

export interface DropQuoteOutput {
  dropDt: Date
  cause: string
  quoteId: string
}

export abstract class QuoteRepository {
  /**
   * Submit a quote for approval.
   * @param quote
   */
  abstract createPendingQuote(quote: IPendingQuote): Promise<IPendingQuote>

  abstract getQuote(
    quoteId: string,
  ): Promise<IPendingQuote | IApprovedQuote | IDroppedQuote>

  // TODO be able to filter by guild (required) and user (optional)
  abstract getRandomApprovedQuote(): Promise<IApprovedQuote>

  /**
   * Approves a pending quote.
   * @param quoteId The id of a pending quote.
   */
  abstract approveQuote(
    quoteId: string,
    cause: string,
    approveDt?: Date,
  ): Promise<ApproveQuoteOutput>

  abstract dropQuote(
    quoteId: string,
    cause: string,
    dropDt?: Date,
  ): Promise<DropQuoteOutput>
}
