import { Module } from '@nestjs/common'
import { EventStoreDBClient } from '@eventstore/db-client'
import { QuoteRepositoryImplService } from './services/quote-repository-impl/quote-repository-impl.service'
import { ReceiveRepositoryImplService } from './services/receive-repository-impl/receive-repository-impl.service'
import { PrefixRepositoryImplService } from './services/prefix-repository-impl/prefix-repository-impl.service'
import { EventStoreClientProvider } from './providers/event-store-client.provider'

@Module({
  providers: [
    QuoteRepositoryImplService,
    ReceiveRepositoryImplService,
    PrefixRepositoryImplService,
    EventStoreClientProvider,
  ],

  exports: [EventStoreDBClient],
})
export class RepositoriesModule {}
