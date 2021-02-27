import { Module } from '@nestjs/common'
import { DiscordClientProvider } from './providers/discord.provider'

@Module({
  providers: [DiscordClientProvider],
})
export class DiscordModule {}
