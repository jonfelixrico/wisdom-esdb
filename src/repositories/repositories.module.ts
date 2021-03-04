import { Module } from '@nestjs/common'
import { PrefixRepositoryService } from './prefix-repository/prefix-repository.service'
import { QuoteRepositoryService } from './quote-repository/quote-repository.service'
import { ReceiveRepositoryService } from './receive-repository/receive-repository.service'

@Module({
  providers: [
    PrefixRepositoryService,
    QuoteRepositoryService,
    ReceiveRepositoryService,
  ],
})
export class RepositoriesModule {}
