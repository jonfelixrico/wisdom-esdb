import { Module } from '@nestjs/common'
import { InteractorsModule } from './interactors/interactors.module'

@Module({
  imports: [InteractorsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
