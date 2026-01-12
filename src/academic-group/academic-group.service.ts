import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAcademicGroupDto } from './dto/create-academic-group.dto';
import { UpdateAcademicGroupDto } from './dto/update-academic-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicGroup } from './entities/academic-group.entity';
import { PaginationDTO } from './dto/pagination.dto';
import {
  GROUP_ALREADY_EXIST,
  GROUP_NOT_FOUND,
} from './constants/academic-group.constants';
import slugify from 'slugify';
import { QueryDto } from '../user/dto/query.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AcademicGroupService {
  constructor(
    @InjectRepository(AcademicGroup)
    private academicRepository: Repository<AcademicGroup>,
    private configService: ConfigService,
  ) {}

  async findByName(name: string) {
    const normalizeName = name.toLowerCase();
    const group = await this.academicRepository.findOne({
      where: { name: normalizeName },
    });

    if (group) {
      return group;
    }
    return null;
  }

  async create(createAcademicGroupDto: CreateAcademicGroupDto) {
    const groupExists = await this.findByName(createAcademicGroupDto.name);

    if (groupExists) {
      throw new BadRequestException(GROUP_ALREADY_EXIST);
    }
    const normalizeName = createAcademicGroupDto.name.toLowerCase();

    const academicGroup = await this.academicRepository.create({
      name: normalizeName,
    });
    return await this.academicRepository.save(academicGroup);
  }

  async findAll(params: QueryDto) {
    const baseQuery =
      await this.academicRepository.createQueryBuilder('academic_group');

    const limit =
      +params.limit || +this.configService.get('DEFAULT_PAGE_SIZE') || 10;
    const page = +params.page || 1;

    const skip = (page - 1) * limit;

    const totalQuery = await baseQuery.clone();
    const uniqueIdsResult = await totalQuery
      .select('academic_group.id')
      .getMany();
    const totalCount = uniqueIdsResult.length;
    const results = await baseQuery.limit(limit).offset(skip).getMany();

    return {
      results,
      total: totalCount,
      page: page,
      limit: limit,
    };
  }

  async findOne(id: string) {
    const group = await this.academicRepository.findOne({ where: { id } });

    if (!group) {
      throw new NotFoundException(GROUP_NOT_FOUND);
    }
    return group;
  }

  async update(id: string, updateAcademicGroupDto: UpdateAcademicGroupDto) {
    const group = await this.findOne(id);

    // ----------------- change slug if update academic-group
    const obj = {
      ...updateAcademicGroupDto,
      slug: slugify(updateAcademicGroupDto.name, {
        lower: true,
        strict: true,
        locale: 'uk',
      }),
    };

    // await this.academicRepository.update(group.id, updateAcademicGroupDto);
    await this.academicRepository.update(group.id, obj);
    return await this.findOne(id);
  }

  async remove(id: string) {
    const role = await this.findOne(id);

    if (!role) {
      throw new NotFoundException(GROUP_NOT_FOUND);
    }

    const result = await this.academicRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Запис з ID ${id} не знайдено`);
    }

    return { id, success: true };
  }
}
