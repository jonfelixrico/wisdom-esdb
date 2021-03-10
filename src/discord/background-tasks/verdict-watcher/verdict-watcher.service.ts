import { QuoteInteractorService } from '@interactors/quote-interactor/quote-interactor.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class VerdictWatcherService {
  constructor(private quoteInteractor: QuoteInteractorService) {}
}
