import { Module } from '@nestjs/common'
import { DiscordClientProvider } from './providers/discord.provider'
import { ReceiveWatcherService } from './command-watchers/receive-watcher/receive-watcher.service'
import { SubmitWatcherService } from './command-watchers/submit-watcher/submit-watcher.service'
import { PrefixWatcherService } from './services/prefix-watcher/prefix-watcher.service'
import { InteractorsModule } from '@interactors/interactors.module'
import { RepositoriesModule } from '@/repositories/repositories.module'

@Module({
  providers: [
    DiscordClientProvider,
    ReceiveWatcherService,
    SubmitWatcherService,
    PrefixWatcherService,
  ],

  imports: [InteractorsModule, RepositoriesModule],
})
export class DiscordModule {}
