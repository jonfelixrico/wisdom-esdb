import { Test, TestingModule } from '@nestjs/testing';
import { ReceiveInteractorService } from './receive-interactor.service';

describe('ReceiveInteractorService', () => {
  let service: ReceiveInteractorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceiveInteractorService],
    }).compile();

    service = module.get<ReceiveInteractorService>(ReceiveInteractorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
