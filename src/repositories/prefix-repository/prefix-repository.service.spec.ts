import { Test, TestingModule } from '@nestjs/testing'
import { PrefixRepositoryService } from './prefix-repository.service'

describe('PrefixRepositoryService', () => {
  let service: PrefixRepositoryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrefixRepositoryService],
    }).compile()

    service = module.get<PrefixRepositoryService>(PrefixRepositoryService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
