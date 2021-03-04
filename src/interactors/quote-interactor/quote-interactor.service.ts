import { Injectable } from '@nestjs/common'
import { QuoteRepository } from '@repositories/models/quote-repository.abstract'
import { IQuoteBody } from '@models/quote.interface'
import { generateId } from '@utils/id-generator.util'
import { ErrorCodes } from '@models/error-codes.enum'
import { IPendingQuote } from '@models/pending-quote.interface'
import { QuoteStatus, getQuoteStatus } from '@utils/quote-utils.util'
import { GuildRepository } from '@repositories/models/guild-repository.abstract'
import moment from 'moment-timezone'

// TODO make an enum for this
const EXPIRE_REJECT_CAUSE = 'QUOTE_EXPIRED'

@Injectable()
export class QuoteInteractorService {
  constructor(
    private quoteRepo: QuoteRepository,
    private guildRepo: GuildRepository,
  ) {}

  async submitQuote(quote: IQuoteBody) {
    const { guild } = quote
    const id = generateId(quote)
    const { guildRepo } = this
    const expireDt = moment()
      .tz(await guildRepo.getTimezone(guild))
      .add(await guildRepo.getDaysForQuoteExpiration(guild), 'days')
      .toDate()

    return await this.quoteRepo.submitQuote({
      id,
      expireDt,
      ...quote,
    })
  }

  private async findPendingQuote(quoteId: string) {
    const quote = await this.quoteRepo.getQuote(quoteId)

    if (!quote) {
      // TODO create an enum for all the errors
      throw new Error(ErrorCodes.QUOTE_NOT_FOUND)
    }

    if (getQuoteStatus(quote) !== QuoteStatus.PENDING) {
      throw new Error(ErrorCodes.QUOTE_NOT_PENDING)
    }

    return quote as IPendingQuote
  }

  async approveQuote(quoteId: string, cause: string) {
    const { id } = await this.findPendingQuote(quoteId)
    await this.quoteRepo.approveQuote(id, cause)
  }

  /**
   * Checks a pending quote if it's expired. If the provided `quoteId`
   * is not associated with any quote, or if the assoc. quote is already
   * approved or dropped, this will throw an error.
   *
   * @param quoteId
   * @returns The promise will resolve undefined if the quote is not yet expired,
   *   else the quote in its expried form will be returned.
   */
  async checkPendingQuoteForExpiration(quoteId: string) {
    const quote = await this.findPendingQuote(quoteId)

    if (Date.now() < quote.expireDt.getTime()) {
      return
    }

    return await this.quoteRepo.dropQuote(quoteId, EXPIRE_REJECT_CAUSE)
  }
}
