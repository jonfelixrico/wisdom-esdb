import { Module } from '@nestjs/common'
import { EventStoreDBClient } from '@eventstore/db-client'
import { QuoteRepositoryImplService } from './services/quote-repository-impl/quote-repository-impl.service'
import { ReceiveRepositoryImplService } from './services/receive-repository-impl/receive-repository-impl.service'
import { EventStoreClientProvider } from './providers/event-store-client.provider'
import { GuildRepositoryImplService } from './services/guild-repository-impl/guild-repository-impl.service'
import { QuoteRepository } from '@repositories/models/quote-repository.abstract'
import { GuildRepository } from '@repositories/models/guild-repository.abstract'

@Module({
  providers: [
    {
      useClass: QuoteRepositoryImplService,
      provide: QuoteRepository,
    },
    {
      useClass: GuildRepositoryImplService,
      provide: GuildRepository,
    },
    ReceiveRepositoryImplService,
    EventStoreClientProvider,
  ],

  exports: [EventStoreDBClient],
})
export class RepositoriesModule {}
