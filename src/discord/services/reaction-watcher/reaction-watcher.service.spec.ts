import { Test, TestingModule } from '@nestjs/testing'
import { ReactionWatcherService } from './reaction-watcher.service'

describe('ReactionWatcherService', () => {
  let service: ReactionWatcherService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReactionWatcherService],
    }).compile()

    service = module.get<ReactionWatcherService>(ReactionWatcherService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
