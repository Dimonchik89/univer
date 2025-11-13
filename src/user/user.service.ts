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
import { PaginationDTO } from '../academic-group/dto/pagination.dto';
import { USER_NOT_FOUND } from '../auth/constants/auth.constants';
import { ConfigService } from '@nestjs/config';
import { CANNOT_GET_THIS_USER_PROFILE } from './constants/user.constants';
import { ROLE_BY_SLUG_NOT_FOUND, ROLE_NOT_FOUND } from '../role/constants/role.constants';
import { QueryDto } from './dto/query.dto';
import { AcademicGroup } from '../academic-group/entities/academic-group.entity';
import { GROUP_BY_SLUG_NOT_FOUND, GROUP_NOT_FOUND } from '../academic-group/constants/academic-group.constants';

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

	async findAll(paginationDTO: PaginationDTO) {
		const take = +paginationDTO.limit || this.configService.get("DEFAULT_PAGE_SIZE");
		const skip = (+paginationDTO.page - 1 || 0) * take;

		return await this.userRepository.findAndCount({
			skip,
			take,
			relations: ['roles', 'academic_groups'],
			select: ["id", "email", "firstName", "lastName", "avatarUrl", "roles", "academic_groups", "createdAt", "updatedAt"],
			order: {
				"createdAt": "DESC"
			}
		});
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

	async getUsersByRoleSlug(roleSlug: string, query: QueryDto): Promise<[User[], number]> {
		const role = await this.roleRepository.find({ where: { slug: roleSlug }})

		if(!role) {
			throw new NotFoundException(ROLE_BY_SLUG_NOT_FOUND);
		}

		const take = +query.limit || +this.configService.get("DEFAULT_PAGE_SIZE") || 10;
		const skip = (+query.page - 1 || 0) * take;

		const users = await this.userRepository
			.createQueryBuilder("user")
			.leftJoinAndSelect("user.roles", "role")
			.leftJoinAndSelect("user.academic_groups", "academic_group")
			.select(["user.id", "user.email", "user.firstName", "user.lastName", "user.avatarUrl", "user.createdAt", "role.id", "role.name", "role.slug", "academic_group.id", "academic_group.slug", "academic_group.name"])
			.where("role.slug = :roleSlug", { roleSlug })
			.orderBy("user.createdAt", "DESC")
			.skip(skip)
			.take(take)
			.getManyAndCount()

		return users;
	}

	async getUsersByRoleId(id: string, query: QueryDto): Promise<[User[], number]> {
		const role = await this.roleRepository.find({ where: { id }})

		if(!role) {
			throw new NotFoundException(ROLE_NOT_FOUND);
		}

		const take = +query.limit || +this.configService.get("DEFAULT_PAGE_SIZE") || 10;
		const skip = (+query.page - 1 || 0) * take;

		const users = await this.userRepository
			.createQueryBuilder("user")
			.leftJoinAndSelect("user.roles", "role")
			.leftJoinAndSelect("user.academic_groups", "academic_group")
			.select(["user.id", "user.email", "user.firstName", "user.lastName", "user.avatarUrl", "user.createdAt", "role.id", "role.name", "role.slug", "academic_group.id", "academic_group.slug", "academic_group.name"])
			.where("role.id = :id", { id })
			.orderBy("user.createdAt", "DESC")
			.skip(skip)
			.take(take)
			.getManyAndCount()

		return users;
	}

	async getUsersByAcademicGroupId(id: string, query: QueryDto) {
		const group = await this.academicGroup.findOne({ where: { id }})

		if(!group) {
			throw new NotFoundException(GROUP_NOT_FOUND)
		}

		const take = +query.limit || +this.configService.get("DEFAULT_PAGE_SIZE") || 10;
		const skip = (+query.page - 1 || 0) * take;

		const users = await this.userRepository
			.createQueryBuilder("user")
			.leftJoinAndSelect("user.roles", "role")
			.leftJoinAndSelect("user.academic_groups", "academic_group")
			.select(["user.id", "user.email", "user.firstName", "user.lastName", "user.avatarUrl", "user.createdAt", "role.id", "role.name", "role.slug", "academic_group.id", "academic_group.slug", "academic_group.name"])
			.where("academic_group.id = :id", { id })
			.orderBy("user.createdAt", "DESC")
			.skip(skip)
			.take(take)
			.getManyAndCount()

		return users;
	}

	async getUsersByAcademicGroupSlug(slug: string, query: QueryDto) {
		const group = await this.academicGroup.findOne({ where: { slug }})

		if(!group) {
			throw new NotFoundException(GROUP_BY_SLUG_NOT_FOUND)
		}

		const take = +query.limit || +this.configService.get("DEFAULT_PAGE_SIZE") || 10;
		const skip = (+query.page - 1 || 0) * take;

		const users = await this.userRepository
			.createQueryBuilder('user')
			.leftJoinAndSelect("user.roles", "role")
			.leftJoinAndSelect("user.academic_groups", "academic_group")
			.select(["user.id", "user.email", "user.firstName", "user.lastName", "user.avatarUrl", "user.createdAt", "role.id", "role.name", "role.slug", "academic_group.id", "academic_group.slug", "academic_group.name"])
			.where("academic_group.slug = :slug", { slug })
			.orderBy("user.createdAt", "DESC")
			.skip(skip)
			.take(take)
			.getManyAndCount()

		return users;
	}

	async search(query: string) {
		if (!query) {
			return [];
		}

		// const tsQueryEnglish = `plainto_tsquery('english', :query)`;
		// const tsQueryRussian = `plainto_tsquery('russian', :query)`;

		// const combinedQuery = `${tsQueryEnglish} || ${tsQueryRussian}`;

		// return this.userRepository
		// 	.createQueryBuilder("user")
		// 	.addSelect(`ts_rank(user.search_vector, (${combinedQuery}))`, "rank")
		// 	.where(`search_vector @@ (${combinedQuery})`, { query })
		// 	.orderBy("rank", "DESC")
      	// 	.getMany();




		if (!query || query.trim().length === 0) {
            return [];
        }

        // 1. Создаем мультиязычный to_tsquery
        // Используем plainto_tsquery, так как оно лучше подходит для пользовательского ввода.
        const tsQueryEnglish = `plainto_tsquery('english', :query)`;
        const tsQueryRussian = `plainto_tsquery('russian', :query)`;

        // Объединяем запросы для поиска совпадений в обоих языковых векторах.
        const combinedQuery = `${tsQueryEnglish} || ${tsQueryRussian}`;

        // 2. Выполняем запрос с ранжированием
        const usersWithRank = await this.userRepository
            .createQueryBuilder("user")

            // Добавляем вычисляемый столбец 'rank' для сортировки.
            // Используем 'user.search_vector' (без двойных кавычек вокруг алиаса в TypeORM)
            .addSelect(`ts_rank(user.search_vector, ${combinedQuery})`, "rank")

            // Фильтруем: проверяем, что search_vector совпадает с объединенным tsquery.
            .where(`user.search_vector @@ (${combinedQuery})`, { query: query })

            // Сортируем по рангу в убывающем порядке (самые релевантные вверху)
            .orderBy("rank", 'DESC')

            // Выбираем все поля пользователя и добавленный ранг
            .select([
                'user.id',
                'user.email',
                'user.firstName',
                'user.lastName',
                'user.role',
                'user.academicGroup',
                'rank' // Обязательно добавляем "rank" в select, если используем addSelect
            ])
            .getRawAndEntities();
            // Используем getRawAndEntities(), чтобы вернуть сущности User,
            // а не только необработанные данные, и при этом получить "rank".

        // Возвращаем только сущности User (rank будет в объекте raw, если нужен)
        // Для простоты вернем полный результат, включая raw data:
        return usersWithRank.entities;



	}
}
