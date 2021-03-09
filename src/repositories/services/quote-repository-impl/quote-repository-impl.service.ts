import { IApprovedQuote } from '@models/approved-quote.interface'
import { IDroppedQuote } from '@models/dropped-quote.interface'
import { IPendingQuote } from '@models/pending-quote.interface'
import { Injectable } from '@nestjs/common'
import {
  ApproveQuoteOutput,
  DropQuoteOutput,
  QuoteRepository,
} from '@repositories/models/quote-repository.abstract'
import { EventStoreDBClient, jsonEvent } from '@eventstore/db-client'
import { EsdbEvents } from '@repositories/models/esdb-events.enum'
import { random } from 'lodash'
import { IQuote } from '@models/quote.interface'

@Injectable()
export class QuoteRepositoryImplService extends QuoteRepository {
  constructor(private esdb: EventStoreDBClient) {
    super()
  }

  private approved: { [key: string]: IApprovedQuote } = {}
  private pending: { [key: string]: IPendingQuote } = {}
  private dropped: { [key: string]: IDroppedQuote } = {}

  async createPendingQuote(quote: IPendingQuote): Promise<IPendingQuote> {
    const submitQuoteEvent = jsonEvent({
      type: EsdbEvents.QUOTE_SUBMITTED,
      data: { ...quote },
    })

    await this.esdb.appendToStream(quote.id, submitQuoteEvent)
    this.pending[quote.id] = quote
    return quote
  }

  async getQuote(
    quoteId: string,
  ): Promise<IPendingQuote | IApprovedQuote | IDroppedQuote> {
    return (
      this.approved[quoteId] ||
      this.pending[quoteId] ||
      this.dropped[quoteId] ||
      null
    )
  }

  async getRandomApprovedQuote(): Promise<IApprovedQuote> {
    const { approved } = this
    const keys = Object.keys(approved)

    if (!keys.length) {
      return null
    }

    return approved[random(0, keys.length - 1, false)]
  }

  async approveQuote(
    quoteId: string,
    cause: string,
    approveDt: Date = new Date(),
  ): Promise<ApproveQuoteOutput> {
    const { esdb, approved, pending, dropped } = this

    const event = jsonEvent({
      type: EsdbEvents.QUOTE_APPROVED,
      data: {
        quoteId,
        cause,
        approveDt,
      },
    })

    await esdb.appendToStream(quoteId, event)

    const quote: IQuote = pending[quoteId] || dropped[quoteId]

    delete pending[quoteId]
    delete dropped[quoteId]
    approved[quoteId] = {
      ...quote,
      approveDt,
      approveCause: cause,
    }

    return {
      quoteId,
      cause,
      approveDt,
    }
  }

  async dropQuote(
    quoteId: string,
    cause: string,
    dropDt: Date = new Date(),
  ): Promise<DropQuoteOutput> {
    const { esdb, approved, pending, dropped } = this

    const event = jsonEvent({
      type: EsdbEvents.QUOTE_APPROVED,
      data: {
        quoteId,
        cause,
        dropDt,
      },
    })

    await esdb.appendToStream(quoteId, event)

    const quote: IQuote = approved[quoteId] || pending[quoteId]
    delete approved[quoteId]
    delete pending[quoteId]
    dropped[quoteId] = {
      ...quote,
      dropDt,
      dropCause: cause,
    }

    return {
      quoteId,
      cause,
      dropDt,
    }
  }
}
