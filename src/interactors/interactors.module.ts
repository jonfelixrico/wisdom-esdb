import { Module } from '@nestjs/common'
import { QuoteInteractorService } from './quote-interactor/quote-interactor.service'

@Module({
  providers: [QuoteInteractorService],
})
export class InteractorsModule {}
