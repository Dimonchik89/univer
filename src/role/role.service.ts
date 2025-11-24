import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { ROLE_ALREADY_EXIST, ROLE_NOT_FOUND } from './constants/role.constants';


@Injectable()
export class RoleService {
	constructor(
		@InjectRepository(Role) private roleRepository: Repository<Role>
	) {}

	async findRoleByName(name: string) {
		const normalizeName = name.toLowerCase();
		const role = await this.roleRepository.findOne({ where: { name: normalizeName }});

		return role;
	}

	async create(createRoleDto: CreateRoleDto) {
		const role = await this.findRoleByName(createRoleDto.name);

		if(role) {
			throw new BadRequestException(ROLE_ALREADY_EXIST);
		}

		const normalizeName = createRoleDto.name.toLowerCase()
		const newRole = await this.roleRepository.create({ name: normalizeName });
		return await this.roleRepository.save(newRole);
	}

	async findAll() {
		// return await this.roleRepository.findAndCount();
		const baseQuery = await this.roleRepository
			.createQueryBuilder("role");

		const totalQuery = await baseQuery.clone();
		const uniqueIdsResult = await totalQuery
			.select('role.id')
    		.getMany();
		const totalCount = await uniqueIdsResult.length;
		const results = await baseQuery.getMany()

		return {
			results,
			total: totalCount,
			page: 1,
			limit: totalCount
		}
	}

	async findOne(id: string) {
		const role = await this.roleRepository.findOne({ where: { id }})

		if(!role) {
			throw new NotFoundException(ROLE_NOT_FOUND)
		}

		return role;
	}

	async update(id: string, updateRoleDto: UpdateRoleDto) {
		const role = await this.roleRepository.findOne({ where: { id }})

		if(!role) {
			throw new NotFoundException(ROLE_NOT_FOUND);
		}

		const payload = { name: updateRoleDto.name.toLowerCase() }
		await this.roleRepository.update(id, payload);
		const changedRole = this.findOne(id);
		return changedRole;
	}

	async remove(id: string) {
		try {
			const findRole = await this.findOne(id);

			if(findRole.slug === "administrator") {
				throw new BadRequestException("The role cannot be deleted");
			}

			return await this.roleRepository.delete({ id });
		} catch(error) {
			throw new NotFoundException(error.message)
		}
	}
}
