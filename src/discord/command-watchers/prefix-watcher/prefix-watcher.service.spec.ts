import { Test, TestingModule } from '@nestjs/testing'
import { PrefixWatcherService } from './prefix-watcher.service'

describe('PrefixWatcherService', () => {
  let service: PrefixWatcherService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrefixWatcherService],
    }).compile()

    service = module.get<PrefixWatcherService>(PrefixWatcherService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
