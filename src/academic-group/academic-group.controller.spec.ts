import { Test, TestingModule } from '@nestjs/testing';
import { AcademicGroupController } from './academic-group.controller';
import { AcademicGroupService } from './academic-group.service';

describe('AcademicGroupController', () => {
  let controller: AcademicGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcademicGroupController],
      providers: [AcademicGroupService],
    }).compile();

    controller = module.get<AcademicGroupController>(AcademicGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
