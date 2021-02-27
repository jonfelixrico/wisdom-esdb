import { Test, TestingModule } from '@nestjs/testing'
import { CommandEventBusService } from './command-event-bus.service'

describe('CommandEventBusService', () => {
  let service: CommandEventBusService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommandEventBusService],
    }).compile()

    service = module.get<CommandEventBusService>(CommandEventBusService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
