import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAcademicGroupDto } from './dto/create-academic-group.dto';
import { UpdateAcademicGroupDto } from './dto/update-academic-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicGroup } from './entities/academic-group.entity';
import { PaginationDTO } from './dto/pagination.dto';
import { GROUP_ALREADY_EXIST, GROUP_NOT_FOUND } from './constants/academic-group.constants';


@Injectable()
export class AcademicGroupService {
	constructor(
		@InjectRepository(AcademicGroup)
		private academicRepository: Repository<AcademicGroup>,
	) {}

	async findByName(name: string) {
		const normalizeName = name.toLowerCase();
		const group = await this.academicRepository.findOne({ where: { name: normalizeName }});

		if(group) {
			return group;
		}
		return null;
	}

	async create(createAcademicGroupDto: CreateAcademicGroupDto) {
		const groupExists = await this.findByName(createAcademicGroupDto.name);

		if(groupExists) {
			throw new BadRequestException(GROUP_ALREADY_EXIST);
		}
		const normalizeName = createAcademicGroupDto.name.toLowerCase()

		const academicGroup = await this.academicRepository.create({
			name: normalizeName
		});
		return await this.academicRepository.save(academicGroup);
	}

	async findAll() { // можна додати для пагiнацii але краще повертати весь список ы легше буде вибрати потрiбнi группи для вiдправки повiдомлення --- paginationDTO: PaginationDTO
		// const take = +paginationDTO.limit || DEFAULT_PAGE_SIZE;
		// const skip = (+paginationDTO.page - 1 || 0) * take;

		// return await this.academicRepository.findAndCount({ skip, take });
		return await this.academicRepository.find({
			order: {
				"createdAt": "DESC"
			}
		});
	}

	async findOne(id: string) {
		const group = await this.academicRepository.findOne({ where: { id } });

		if(!group) {
			throw new NotFoundException(GROUP_NOT_FOUND);
		}
		return group;
	}

	async update(id: string, updateAcademicGroupDto: UpdateAcademicGroupDto) {
		const group = await this.findOne(id);

		await this.academicRepository.update(group.id, updateAcademicGroupDto);
		return await this.findOne(id);
	}

	async remove(id: string) {
		const role = await this.findOne(id);

		return await this.academicRepository.delete({ id });
	}
}
