import { Test, TestingModule } from '@nestjs/testing'
import { ApproveInteractorService } from './approve-interactor.service'

describe('ApproveInteractorService', () => {
  let service: ApproveInteractorService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApproveInteractorService],
    }).compile()

    service = module.get<ApproveInteractorService>(ApproveInteractorService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
