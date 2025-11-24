import {
	BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { genSalt, hash } from 'bcryptjs';
import {
  DEFAULT_ROLE_NOT_FOUND,
} from '../common/constants';
import { Role } from '../role/entities/role.entity';
import * as argon2 from 'argon2';
import { USER_NOT_FOUND } from '../auth/constants/auth.constants';
import { ConfigService } from '@nestjs/config';
import { CANNOT_GET_THIS_USER_PROFILE } from './constants/user.constants';
import { ROLE_BY_SLUG_NOT_FOUND, ROLE_NOT_FOUND } from '../role/constants/role.constants';
import { QueryDto } from './dto/query.dto';
import { AcademicGroup } from '../academic-group/entities/academic-group.entity';
import { GROUP_BY_SLUG_NOT_FOUND, GROUP_NOT_FOUND } from '../academic-group/constants/academic-group.constants';
import { FindAllQueryDto } from './dto/findAll.query.dto';
import { SearchQueryDto } from './dto/search.query.gto';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
		@InjectRepository(Role) private roleRepository: Repository<Role>,
		@InjectRepository(AcademicGroup) private academicGroup: Repository<AcademicGroup> ,
		private configService: ConfigService
	) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		let rolesToAssign: Role[] = [];
		const salt = await genSalt(10);
		const hashedPassword = await hash(createUserDto.password, salt);

			if (createUserDto.roles && createUserDto.roles.length > 0) {
				rolesToAssign = createUserDto.roles as Role[];
			} else {
				const defaultRole = await this.roleRepository.findOne({
					where: { name: process.env.DEFAULT_ROLE_NAME },
					select: ['id'],
			});

			if (!defaultRole) {
				throw new BadRequestException(DEFAULT_ROLE_NOT_FOUND);
			}

			rolesToAssign = [defaultRole]; // за замовченням предажмо роль за заданив в .env (Студент) кожному користувачу хто не передав масив з id ролями ([{ "id": "uiyui-dkcjjasd-sda" }]) при створеннi
		}

		const { email, password, roles, ...tailUserDto } = createUserDto;

		const createdUser = await this.userRepository.save({
			...tailUserDto,
			email: createUserDto.email,
			passwordHash: hashedPassword,
			roles: rolesToAssign,
		});
		return await this.userRepository.findOne({
			where: { id: createdUser.id },
			relations: ['roles', 'academic_groups'],
			select: ['id', 'firstName', 'lastName', 'email', 'academic_groups', 'roles', 'avatarUrl']
		});
	}

	async findAll(paginationDTO: FindAllQueryDto) {
		let query = await this.userRepository
			.createQueryBuilder("user")
			.leftJoinAndSelect("user.roles", "role")
			.leftJoinAndSelect("user.academic_groups", "academic_group")

		// шукаэмо користувачiв у яких э хочаю одна роль з переданних
		if(paginationDTO.role && Array.isArray(paginationDTO.role)) {
			query = query
				.where("role.id IN (:...rolesId)", { rolesId: paginationDTO.role })
		}

		if(paginationDTO.role && !Array.isArray(paginationDTO.role)) {
			query = query
				.where("role.id = :roleId", { roleId: paginationDTO.role })
		}

		if(paginationDTO.group && Array.isArray(paginationDTO.group)) {
			query = query
				.where("academic_group.id IN (:...groupsId)", { groupsId: paginationDTO.group })
		}

		if(paginationDTO.group && !Array.isArray(paginationDTO.group)) {
			query = query
				.where("academic_group.id = :groupId", { groupId: paginationDTO.group })
		}

		const totalQuery = await query.clone();
    	const uniqueIdsResult = await totalQuery
    		.getMany();

		const totalCount = uniqueIdsResult.length;
		const limit = +paginationDTO.limit || +this.configService.get("DEFAULT_PAGE_SIZE")
		const page = paginationDTO.page || 1

		const skip = (page - 1) * limit;

		const results = await query
			.select(["user.id", "user.email", "user.firstName", "user.lastName", "user.avatarUrl", "user.createdAt", "role.id", "role.name", "role.slug", "academic_group.id", "academic_group.name", "academic_group.slug"])
			.orderBy("user.createdAt", "DESC")
			.limit(limit)
			.offset(skip)
			.getMany();

		return {
			results,
			total: totalCount,
			page,
			limit
		};
	}

	async findByEmail(email: string) {
		const user = await this.userRepository.findOne({
			where: { email },
			relations: ["roles", "academic_groups"]
		});

		if(!user) {
			throw new NotFoundException(USER_NOT_FOUND);
		}
		return user;
	}

	async findOne({ userIdFromToken, userIdFromParam }: { userIdFromToken: string, userIdFromParam: string }) {
		if(userIdFromToken !== userIdFromParam) {
			throw new BadRequestException(CANNOT_GET_THIS_USER_PROFILE)
		}

		const user = await this.userRepository.findOne({
			where: { id: userIdFromParam },
			relations: ['roles', 'academic_groups'],
			select: ['id', 'firstName', 'lastName', 'email', 'academic_groups', 'roles', 'avatarUrl']
		});

		if(!user) {
			throw new NotFoundException(USER_NOT_FOUND);
		}
		return user;
	}

	async findOneByIdForAdmin(id) {
		const user = await this.userRepository.findOne({
			where: { id },
			relations: ["roles", "academic_groups"],
			select: ["id", "email", "firstName", "lastName", "avatarUrl", "roles", "academic_groups", "updatedAt", "createdAt"]
		});

		if(!user) {
			throw new NotFoundException(USER_NOT_FOUND);
		}
		return user;
	}

	async update({ userIdFromToken, userIdFromParam, updateUserDto }: {	userIdFromToken: string, userIdFromParam: string, updateUserDto: UpdateUserDto}) {
		if(userIdFromToken !== userIdFromParam) {
			throw new BadRequestException(CANNOT_GET_THIS_USER_PROFILE)
		}

		const user = await this.userRepository.findOne({
			where: { id: userIdFromParam },
			relations: ['roles', 'academic_groups'],
		});

		if (!user) {
			throw new NotFoundException(USER_NOT_FOUND);
		}

		const { academic_groups, roles, ...tailUpdateUserDto } = updateUserDto;

		const updatedUser = await this.userRepository.merge(user, tailUpdateUserDto);
		await this.userRepository.save(updatedUser);
		return await this.userRepository.findOne({
			where: { id: updatedUser.id },
			relations: ["roles", "academic_groups"],
			select: ["id", "email", "firstName", "lastName", "avatarUrl", "roles", "academic_groups", "updatedAt", "createdAt"]
		})
	}

	async updateByAdmin(id: string, updateUserDto: UpdateUserDto) {
		const user = await this.userRepository.findOne({
			where: { id },
			relations: ['roles', 'academic_groups'],
		});

		if (!user) {
			throw new NotFoundException(USER_NOT_FOUND);
		}

		if(updateUserDto?.roles) {
			user.roles = user.roles.filter((role) => {
				return updateUserDto?.roles.find((item) => item.id === role.id)
			})
		}

		if(updateUserDto?.academic_groups) {
			user.academic_groups = user.academic_groups.filter((group) => {
				return updateUserDto?.academic_groups.find((item) => item.id === group.id)
			})
		}

		const updatedUser = await this.userRepository.merge(user, updateUserDto);

		await this.userRepository.save(updatedUser);
		return await this.userRepository.findOne({
			where: { id: updatedUser.id },
			relations: ["roles", "academic_groups"],
			select: ["id", "email", "firstName", "lastName", "avatarUrl", "roles", "academic_groups", "updatedAt", "createdAt"]
		})
	}

	async updateHashedRefreshToken(userId: string, refreshToken: string) {
		const hashedRefreshToken = await argon2.hash(refreshToken);

		return await this.userRepository.update(userId, {
		hashedRefreshToken: hashedRefreshToken,
		});
	}

	async remove(id: string) {
		const user = await this.userRepository.findOne({ where: { id }});

		if(!user) {
			throw new NotFoundException(USER_NOT_FOUND)
		}
		return await this.userRepository.delete(id);
	}

	async search(query: SearchQueryDto) {
		if (!query.q) {
			return [];
		}
		const escaped = query.q.replace(/'/g, "''");

		if(!escaped) {
			return []
		}

		const take = +query.limit || +this.configService.get("DEFAULT_PAGE_SIZE");
		const page = +query.page || 1;
		const skip = (+page - 1 || 0) * take;

		// --!!!!!!!!!!!!!!! РАБОЧИЙ только совпадение с началом строки !!!!!!!!!!!!!!!!!!!!!!!!
  		// добавляем * для частичного совпадения
		const tsQueryEnglish = `to_tsquery('english', '${escaped}:*')`;
		const tsQueryRussian = `to_tsquery('russian', '${escaped}:*')`;

		// --------------------- Возврат всего пользователя
		// const sql = `
		// 	SELECT
		// 	"user".*,
		// 	ts_rank_cd(
		// 		"user"."search_vector",
		// 		${tsQueryEnglish} || ${tsQueryRussian}
		// 	) AS rank
		// 	FROM "user"
		// 	WHERE "user"."search_vector" @@ (${tsQueryEnglish} || ${tsQueryRussian})
		// 	ORDER BY rank DESC;
		// `;

		// --------------------- Возврат выбраных полей пользователя (роли и академ_группы просто масив id)
		// const sql = `
		// 	SELECT
		// 		u.id AS user_id,
		// 		u."firstName" AS firstName,
		// 		u."lastName" AS lastName,
		// 		u."email" AS email,
		// 		COALESCE(json_agg(DISTINCT r.id) FILTER (WHERE r.id IS NOT NULL), '[]') AS roles,
		// 		COALESCE(json_agg(DISTINCT ag.id) FILTER (WHERE ag.id IS NOT NULL), '[]') AS academic_groups,
		// 		ts_rank_cd(u.search_vector, ${tsQueryEnglish} || ${tsQueryRussian}) AS rank
		// 	FROM "user" u
		// 	LEFT JOIN user_role ur ON ur."userId" = u.id
		// 	LEFT JOIN role r ON r.id = ur."roleId"
		// 	LEFT JOIN user_academic_group uag ON uag."userId" = u.id
		// 	LEFT JOIN academic_group ag ON ag.id = uag."academicGroupId"
		// 	WHERE u.search_vector @@ (${tsQueryEnglish} || ${tsQueryRussian})
		// 	GROUP BY u.id
		// 	ORDER BY rank DESC;
		// `;

		const sql = `
			SELECT
				u.id AS id,
				u."firstName" AS firstName,
				u."lastName" AS lastName,
				COALESCE(
				json_agg(
					json_build_object(
					'id', r.id,
					'name', r.name,
					'slug', r.slug
					)
				) FILTER (WHERE r.id IS NOT NULL),
				'[]'
				) AS roles,
				COALESCE(
				json_agg(
					json_build_object(
					'id', ag.id,
					'name', ag.name,
					'slug', ag.slug
					)
				) FILTER (WHERE ag.id IS NOT NULL),
				'[]'
				) AS academic_groups,
				ts_rank_cd(u.search_vector, ${tsQueryEnglish} || ${tsQueryRussian}) AS rank
			FROM "user" u
			LEFT JOIN user_role ur ON ur."userId" = u.id
			LEFT JOIN role r ON r.id = ur."roleId"
			LEFT JOIN user_academic_group uag ON uag."userId" = u.id
			LEFT JOIN academic_group ag ON ag.id = uag."academicGroupId"
			WHERE u.search_vector @@ (${tsQueryEnglish} || ${tsQueryRussian})
			GROUP BY u.id
			ORDER BY rank DESC
			LIMIT $1
			OFFSET $2
		`;

		const countSql = `
			SELECT COUNT(*) AS total
			FROM "user" u
			WHERE u.search_vector @@ (${tsQueryEnglish} || ${tsQueryRussian});
		`;

		const [data, countResult] = await Promise.all([
			this.userRepository.query(sql, [take, skip]),
			this.userRepository.query(countSql)
		])

		// return [data, Number(countResult[0].total)]
		return {
			results: data,
			total: Number(countResult[0].total),
			page,
			limit: take
		};



		// --!!!!!!!!!!!!!!! РАБОЧИЙ совпадение с любой частью строки НО работает без миграции тоесть поиск без настроек полнотекстового поиска по индексам, будет искать дольше при большой базе данных!!!!!!!!!!!!!!!!!!!!!!!!
		// return this.userRepository
		// 	.createQueryBuilder("user")
		// 	.leftJoinAndSelect("user.roles", "role")
  		// 	.leftJoinAndSelect("user.academic_groups", "academ_group")
		// 	.select([
		// 		"user.id",
		// 		"user.firstName",
		// 		"user.lastName",
		// 		"role.id",
		// 		"academ_group.id"
		// 	])
		// 	.where(`
		// 		"user"."firstName" ILIKE :q
		// 		OR "user"."lastName" ILIKE :q
		// 		OR "user"."email" ILIKE :q
		// 	`, { q: `%${query}%` })
		// 	.getMany();
  	}

	// ------------------------------------------------------------------------

	// async getUsersByRoleSlug(roleSlug: string, query: QueryDto): Promise<[User[], number]> {
	// 	const role = await this.roleRepository.find({ where: { slug: roleSlug }})

	// 	if(!role) {
	// 		throw new NotFoundException(ROLE_BY_SLUG_NOT_FOUND);
	// 	}

	// 	const take = +query.limit || +this.configService.get("DEFAULT_PAGE_SIZE") || 10;
	// 	const skip = (+query.page - 1 || 0) * take;

	// 	const users = await this.userRepository
	// 		.createQueryBuilder("user")
	// 		.leftJoinAndSelect("user.roles", "role")
	// 		.leftJoinAndSelect("user.academic_groups", "academic_group")
	// 		.select(["user.id", "user.email", "user.firstName", "user.lastName", "user.avatarUrl", "user.createdAt", "role.id", "role.name", "role.slug", "academic_group.id", "academic_group.slug", "academic_group.name"])
	// 		.where("role.slug = :roleSlug", { roleSlug })
	// 		.orderBy("user.createdAt", "DESC")
	// 		.skip(skip)
	// 		.take(take)
	// 		.getManyAndCount()

	// 	return users;
	// }

	// async getUsersByRoleId(id: string, query: QueryDto): Promise<[User[], number]> {
	// 	const role = await this.roleRepository.find({ where: { id }})

	// 	if(!role) {
	// 		throw new NotFoundException(ROLE_NOT_FOUND);
	// 	}

	// 	const take = +query.limit || +this.configService.get("DEFAULT_PAGE_SIZE") || 10;
	// 	const skip = (+query.page - 1 || 0) * take;

	// 	const users = await this.userRepository
	// 		.createQueryBuilder("user")
	// 		.leftJoinAndSelect("user.roles", "role")
	// 		.leftJoinAndSelect("user.academic_groups", "academic_group")
	// 		.select(["user.id", "user.email", "user.firstName", "user.lastName", "user.avatarUrl", "user.createdAt", "role.id", "role.name", "role.slug", "academic_group.id", "academic_group.slug", "academic_group.name"])
	// 		.where("role.id = :id", { id })
	// 		.orderBy("user.createdAt", "DESC")
	// 		.skip(skip)
	// 		.take(take)
	// 		.getManyAndCount()

	// 	return users;
	// }

	// async getUsersByAcademicGroupId(id: string, query: QueryDto) {
	// 	const group = await this.academicGroup.findOne({ where: { id }})

	// 	if(!group) {
	// 		throw new NotFoundException(GROUP_NOT_FOUND)
	// 	}

	// 	const take = +query.limit || +this.configService.get("DEFAULT_PAGE_SIZE") || 10;
	// 	const skip = (+query.page - 1 || 0) * take;

	// 	const users = await this.userRepository
	// 		.createQueryBuilder("user")
	// 		.leftJoinAndSelect("user.roles", "role")
	// 		.leftJoinAndSelect("user.academic_groups", "academic_group")
	// 		.select(["user.id", "user.email", "user.firstName", "user.lastName", "user.avatarUrl", "user.createdAt", "role.id", "role.name", "role.slug", "academic_group.id", "academic_group.slug", "academic_group.name"])
	// 		.where("academic_group.id = :id", { id })
	// 		.orderBy("user.createdAt", "DESC")
	// 		.skip(skip)
	// 		.take(take)
	// 		.getManyAndCount()

	// 	return users;
	// }

	// async getUsersByAcademicGroupSlug(slug: string, query: QueryDto) {
	// 	const group = await this.academicGroup.findOne({ where: { slug }})

	// 	if(!group) {
	// 		throw new NotFoundException(GROUP_BY_SLUG_NOT_FOUND)
	// 	}

	// 	const take = +query.limit || +this.configService.get("DEFAULT_PAGE_SIZE") || 10;
	// 	const skip = (+query.page - 1 || 0) * take;

	// 	const users = await this.userRepository
	// 		.createQueryBuilder('user')
	// 		.leftJoinAndSelect("user.roles", "role")
	// 		.leftJoinAndSelect("user.academic_groups", "academic_group")
	// 		.select(["user.id", "user.email", "user.firstName", "user.lastName", "user.avatarUrl", "user.createdAt", "role.id", "role.name", "role.slug", "academic_group.id", "academic_group.slug", "academic_group.name"])
	// 		.where("academic_group.slug = :slug", { slug })
	// 		.orderBy("user.createdAt", "DESC")
	// 		.skip(skip)
	// 		.take(take)
	// 		.getManyAndCount()

	// 	return users;
	// }
}
