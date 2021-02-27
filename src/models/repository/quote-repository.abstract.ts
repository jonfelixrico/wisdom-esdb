import { IQuoteBody } from '@models/quote.interface'
import { IPendingQuote } from '@models/pending-quote.interface'
import { IApprovedQuote } from '@models/approved-quote.interface'

export abstract class QuoteRepository {
  /**
   * Submit a quote for approval.
   * @param quote
   */
  abstract submitQuote(quote: IQuoteBody): Promise<IPendingQuote>

  /**
   * Retrieve an approved quote from the repository.
   * @param quoteId If provided, then the repository will attempt to find the associated quote.
   *   Else, a random approved quote will be returned.
   */
  abstract getApprovedQuote(quoteId?: string): Promise<IApprovedQuote>

  /**
   * Approves a pending quote.
   * @param quoteId The id of a pending quote.
   */
  abstract approveQuote(quoteId: string): Promise<IApprovedQuote>
}
