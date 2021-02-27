import { Module } from '@nestjs/common'
import { DiscordClientProvider } from './providers/discord.provider'
import { ReceiveWatcherService } from './command-watchers/receive-watcher/receive-watcher.service'
import { SubmitWatcherService } from './command-watchers/submit-watcher/submit-watcher.service'
import { PrefixWatcherService } from './command-watchers/prefix-watcher/prefix-watcher.service'
import { CommandEventBusService } from './services/command-event-bus/command-event-bus.service'

@Module({
  providers: [
    DiscordClientProvider,
    ReceiveWatcherService,
    SubmitWatcherService,
    PrefixWatcherService,
    CommandEventBusService,
  ],
})
export class DiscordModule {}
