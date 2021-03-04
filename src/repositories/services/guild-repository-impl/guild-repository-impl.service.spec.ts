import { Test, TestingModule } from '@nestjs/testing'
import { GuildRepositoryImplService } from './guild-repository-impl.service'

describe('GuildRepositoryImplService', () => {
  let service: GuildRepositoryImplService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuildRepositoryImplService],
    }).compile()

    service = module.get<GuildRepositoryImplService>(GuildRepositoryImplService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
