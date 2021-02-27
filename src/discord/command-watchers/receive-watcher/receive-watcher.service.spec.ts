import { Test, TestingModule } from '@nestjs/testing'
import { ReceiveWatcherService } from './receive-watcher.service'

describe('ReceiveWatcherService', () => {
  let service: ReceiveWatcherService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceiveWatcherService],
    }).compile()

    service = module.get<ReceiveWatcherService>(ReceiveWatcherService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
