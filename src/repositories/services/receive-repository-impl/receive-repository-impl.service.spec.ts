import { Test, TestingModule } from '@nestjs/testing'
import { ReceiveRepositoryImplService } from './receive-repository-impl.service'

describe('ReceiveRepositoryImplService', () => {
  let service: ReceiveRepositoryImplService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceiveRepositoryImplService],
    }).compile()

    service = module.get<ReceiveRepositoryImplService>(
      ReceiveRepositoryImplService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
