import { Test, TestingModule } from '@nestjs/testing'
import { VerdictWatcherService } from './verdict-watcher.service'

describe('VerdictWatcherService', () => {
  let service: VerdictWatcherService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VerdictWatcherService],
    }).compile()

    service = module.get<VerdictWatcherService>(VerdictWatcherService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
