import { Module } from '@nestjs/common'
import { DiscordClientProvider } from './providers/discord.provider'
import { ReceiveWatcherService } from './command-watchers/receive-watcher/receive-watcher.service'
import { SubmitWatcherService } from './command-watchers/submit-watcher/submit-watcher.service'
import { PrefixWatcherService } from './services/prefix-watcher/prefix-watcher.service'
import { InteractorsModule } from '@interactors/interactors.module'
import { RepositoriesModule } from '@/repositories/repositories.module'
import { ReactionWatcherService } from './services/reaction-watcher/reaction-watcher.service'

@Module({
  providers: [
    DiscordClientProvider,
    ReceiveWatcherService,
    SubmitWatcherService,
    PrefixWatcherService,
    ReactionWatcherService,
  ],

  imports: [InteractorsModule, RepositoriesModule],
})
export class DiscordModule {}
