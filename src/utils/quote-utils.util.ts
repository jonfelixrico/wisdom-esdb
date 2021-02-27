import { IApprovedQuote } from '@models/approved-quote.interface'
import { IDroppedQuote } from '@models/dropped-quote.interface'
import { IPendingQuote } from '@models/pending-quote.interface'

export enum QuoteStatus {
  PENDING = 'PENDING',
  DROPPED = 'DROPPED',
  APPROVED = 'APPROVED',
}

interface IQuoteStatusHints {
  dropDt?: Date
  approveDt?: Date
}

export function getQuoteStatus(
  quote: IDroppedQuote | IApprovedQuote | IPendingQuote,
): QuoteStatus {
  const hints = quote as IQuoteStatusHints
  if (hints.approveDt) {
    return QuoteStatus.APPROVED
  } else if (hints.dropDt) {
    return QuoteStatus.DROPPED
  }

  return QuoteStatus.PENDING
}
