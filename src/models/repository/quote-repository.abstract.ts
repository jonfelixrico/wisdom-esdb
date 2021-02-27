import { IQuote } from '@models/quote.interface'
import { IPendingQuote } from '@models/pending-quote.interface'
import { IApprovedQuote } from '@models/approved-quote.interface'
import { IDroppedQuote } from '@models/dropped-quote.interface'

export abstract class QuoteRepository {
  /**
   * Submit a quote for approval.
   * @param quote
   */
  abstract submitQuote(quote: IQuote): Promise<IPendingQuote>

  abstract getQuote(
    quoteId: string,
  ): Promise<IPendingQuote | IApprovedQuote | IDroppedQuote>

  abstract getRandomApprovedQuote(): Promise<IApprovedQuote>

  /**
   * Approves a pending quote.
   * @param quoteId The id of a pending quote.
   */
  abstract approveQuote(quoteId: string): Promise<IApprovedQuote>

  abstract dropQuote(quoteId: string, cause: string): Promise<IDroppedQuote>
}
