import { Test, TestingModule } from '@nestjs/testing'
import { SubmitWatcherService } from './submit-watcher.service'

describe('SubmitWatcherService', () => {
  let service: SubmitWatcherService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubmitWatcherService],
    }).compile()

    service = module.get<SubmitWatcherService>(SubmitWatcherService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
