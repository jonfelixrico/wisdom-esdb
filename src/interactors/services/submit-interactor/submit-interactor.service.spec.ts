import { Test, TestingModule } from '@nestjs/testing'
import { SubmitInteractorService } from './submit-interactor.service'

describe('SubmitInteractorService', () => {
  let service: SubmitInteractorService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubmitInteractorService],
    }).compile()

    service = module.get<SubmitInteractorService>(SubmitInteractorService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
