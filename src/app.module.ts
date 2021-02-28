import { Module } from '@nestjs/common'
import { InteractorsModule } from './interactors/interactors.module'
import { DiscordModule } from './discord/discord.module'
import { RepositoriesModule } from './repositories/repositories.module'

@Module({
  imports: [InteractorsModule, DiscordModule, RepositoriesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
