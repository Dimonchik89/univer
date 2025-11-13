import { Test, TestingModule } from '@nestjs/testing';
import { AcademicGroupService } from './academic-group.service';

describe('AcademicGroupService', () => {
  let service: AcademicGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcademicGroupService],
    }).compile();

    service = module.get<AcademicGroupService>(AcademicGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
