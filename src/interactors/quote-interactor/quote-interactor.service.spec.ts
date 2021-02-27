import { Test, TestingModule } from '@nestjs/testing';
import { QuoteInteractorService } from './quote-interactor.service';

describe('QuoteInteractorService', () => {
  let service: QuoteInteractorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuoteInteractorService],
    }).compile();

    service = module.get<QuoteInteractorService>(QuoteInteractorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
