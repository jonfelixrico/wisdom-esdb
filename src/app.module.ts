import { Module } from '@nestjs/common'
import { InteractorsModule } from './interactors/interactors.module'
import { DiscordModule } from './discord/discord.module'

@Module({
  imports: [InteractorsModule, DiscordModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
