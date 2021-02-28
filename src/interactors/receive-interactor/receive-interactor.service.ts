import { Injectable } from '@nestjs/common'
import { ReceiveRepository } from '@repositories/models/receive-repository.abstract'
import { QuoteRepository } from '@/repositories/models/quote-repository.abstract'
import { IReceiveBody } from '@models/receive.interface'
import { ErrorCodes } from '@models/error-codes.enum'

@Injectable()
export class ReceiveInteractorService {
  constructor(
    private receiveRepo: ReceiveRepository,
    private quoteRepo: QuoteRepository,
  ) {}

  async receiveQuote(input: IReceiveBody) {
    const randomQuote = await this.quoteRepo.getRandomApprovedQuote()
    if (!randomQuote) {
      throw new Error(ErrorCodes.NO_AVAILABLE_QUOTES)
    }

    return await this.receiveRepo.createReceive(randomQuote.id, input)
  }

  // TODO filtered receive quote
}
