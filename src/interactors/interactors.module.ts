import { RepositoriesModule } from '@repositories/repositories.module'
import { Module } from '@nestjs/common'
import { QuoteInteractorService } from './quote-interactor/quote-interactor.service'
import { ReceiveInteractorService } from './receive-interactor/receive-interactor.service'

@Module({
  providers: [QuoteInteractorService, ReceiveInteractorService],
  imports: [RepositoriesModule],
  exports: [QuoteInteractorService, ReceiveInteractorService],
})
export class InteractorsModule {}
