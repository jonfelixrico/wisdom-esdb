import { Test, TestingModule } from '@nestjs/testing'
import { QuoteRepositoryImplService } from './quote-repository-impl.service'

describe('QuoteRepositoryImplService', () => {
  let service: QuoteRepositoryImplService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuoteRepositoryImplService],
    }).compile()

    service = module.get<QuoteRepositoryImplService>(QuoteRepositoryImplService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
