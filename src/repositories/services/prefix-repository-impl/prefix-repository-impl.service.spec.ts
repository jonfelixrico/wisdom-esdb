import { Test, TestingModule } from '@nestjs/testing'
import { PrefixRepositoryImplService } from './prefix-repository-impl.service'

describe('PrefixRepositoryImplService', () => {
  let service: PrefixRepositoryImplService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrefixRepositoryImplService],
    }).compile()

    service = module.get<PrefixRepositoryImplService>(
      PrefixRepositoryImplService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
