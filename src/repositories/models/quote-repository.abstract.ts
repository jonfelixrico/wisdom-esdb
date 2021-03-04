import { IPendingQuote } from '@models/pending-quote.interface'
import { IApprovedQuote } from '@models/approved-quote.interface'
import { IDroppedQuote } from '@models/dropped-quote.interface'

export abstract class QuoteRepository {
  /**
   * Submit a quote for approval.
   * @param quote
   */
  abstract submitQuote(quote: IPendingQuote): Promise<IPendingQuote>

  abstract getQuote(
    quoteId: string,
  ): Promise<IPendingQuote | IApprovedQuote | IDroppedQuote>

  // TODO be able to filter by guild (required) and user (optional)
  abstract getRandomApprovedQuote(): Promise<IApprovedQuote>

  /**
   * Approves a pending quote.
   * @param quoteId The id of a pending quote.
   */
  abstract approveQuote(quoteId: string): Promise<IApprovedQuote>

  abstract dropQuote(quoteId: string, cause: string): Promise<IDroppedQuote>
}
