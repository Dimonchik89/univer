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
import { DEFAULT_ROLE_NOT_FOUND } from '../common/constants';
import { Role } from '../role/entities/role.entity';
import * as argon2 from 'argon2';
import { USER_NOT_FOUND } from '../auth/constants/auth.constants';
import { ConfigService } from '@nestjs/config';
import { CANNOT_GET_THIS_USER_PROFILE } from './constants/user.constants';
import { AcademicGroup } from '../academic-group/entities/academic-group.entity';
import { FindAllQueryDto } from './dto/findAll.query.dto';
import { SearchQueryDto } from './dto/search.query.dto';
import { Chat } from '../chat/entities/chat.entity';
import { ChatMember } from '../chat/entities/chat-member.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(AcademicGroup)
    private academicGroup: Repository<AcademicGroup>,
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
    @InjectRepository(ChatMember)
    private readonly chatMemberRepository: Repository<ChatMember>,
    private configService: ConfigService,
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
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'academic_groups',
        'roles',
        'avatarUrl',
      ],
    });
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['roles', 'academic_groups'],
    });

    return user;
  }

  async findOne({
    userIdFromToken,
    userIdFromParam,
  }: {
    userIdFromToken: string;
    userIdFromParam: string;
  }) {
    if (userIdFromToken !== userIdFromParam) {
      throw new BadRequestException(CANNOT_GET_THIS_USER_PROFILE);
    }

    const user = await this.userRepository.findOne({
      where: { id: userIdFromParam },
      relations: ['roles', 'academic_groups'],
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'academic_groups',
        'roles',
        'avatarUrl',
      ],
    });

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return user;
  }

  async findOneByIdForAdmin(id) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'academic_groups'],
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'avatarUrl',
        'roles',
        'academic_groups',
        'updatedAt',
        'createdAt',
      ],
    });

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return user;
  }

  async update({
    userIdFromToken,
    userIdFromParam,
    updateUserDto,
  }: {
    userIdFromToken: string;
    userIdFromParam: string;
    updateUserDto: UpdateUserDto;
  }) {
    if (userIdFromToken !== userIdFromParam) {
      throw new BadRequestException(CANNOT_GET_THIS_USER_PROFILE);
    }

    const user = await this.userRepository.findOne({
      where: { id: userIdFromParam },
      relations: ['roles', 'academic_groups'],
    });

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    const { academic_groups, roles, ...tailUpdateUserDto } = updateUserDto;

    const updatedUser = await this.userRepository.merge(
      user,
      tailUpdateUserDto,
    );
    await this.userRepository.save(updatedUser);
    return await this.userRepository.findOne({
      where: { id: updatedUser.id },
      relations: ['roles', 'academic_groups'],
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'avatarUrl',
        'roles',
        'academic_groups',
        'updatedAt',
        'createdAt',
      ],
    });
  }

  async updateByAdmin(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'academic_groups'],
    });

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    // Видалэмо з чатiв в группу яких бiльше не входить
    const oldGroupIds = user.academic_groups.map((item) => item.id);
    const newGroupIds = updateUserDto.academic_groups.map((item) => item.id);
    const removedGroupIds = oldGroupIds.filter(
      (id) => !newGroupIds.includes(id),
    );

    for (const groupId of removedGroupIds) {
      const chat = await this.chatRepository.findOne({
        where: {
          academicGroup: { id: groupId },
        },
      });

      if (!chat) continue;

      await this.chatMemberRepository.delete({
        chat: { id: chat.id },
        user: { id: user.id },
      });
    }
    // ----------------------------------------

    if (updateUserDto?.roles) {
      user.roles = user.roles.filter((role) => {
        return updateUserDto?.roles.find((item) => item.id === role.id);
      });
    }

    if (updateUserDto?.academic_groups) {
      user.academic_groups = user.academic_groups.filter((group) => {
        return updateUserDto?.academic_groups.find(
          (item) => item.id === group.id,
        );
      });
    }

    const updatedUser = await this.userRepository.merge(user, updateUserDto);

    // Додажмо в новi чати
    for (const group of updatedUser.academic_groups) {
      const chat = await this.chatRepository.findOne({
        where: {
          academicGroup: {
            id: group.id,
          },
        },
      });

      const existInChat = await this.chatMemberRepository.findOne({
        where: {
          chat: { id: chat.id },
          user: { id: updatedUser.id },
        },
      });

      if (!existInChat) {
        await this.chatMemberRepository.save({
          chat,
          user: updatedUser,
          lastReadAt: null,
        });
      }
    }
    // ----------------------------------------

    await this.userRepository.save(updatedUser);
    return await this.userRepository.findOne({
      where: { id: updatedUser.id },
      relations: ['roles', 'academic_groups'],
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'avatarUrl',
        'roles',
        'academic_groups',
        'updatedAt',
        'createdAt',
      ],
    });
  }

  async updateHashedRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await argon2.hash(refreshToken);

    return await this.userRepository.update(userId, {
      hashedRefreshToken: hashedRefreshToken,
    });
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return await this.userRepository.delete(id);
  }

  //   !!!!!!!!!!!!!!!!!!!!!!!!!!!-------------------------!!!!!!!!!!!!!!!!!!!!!!!!!!
  //   Тестовый сервис чтоб обьеденить и обычный возврат всех пользователей и сращу в нем реализация полнотекстого поиска.  протестировать и если все хорошо сменить документацию и удалить сервисы findAll и search (ВРОДЕ РАБОТАЕТ, ПРОТЕСТИТЬ ЕЩЕ И ЕСЛИ ОК ТО СМЕНИТЬ ИМЯ DTO ТОЖЕ)

  async findAllAndSearch(dto: SearchQueryDto) {
    const { q, roles, academic_groups, page = 1, limit = 10 } = dto;
    const skip = (+page - 1) * +limit;

    const params: any[] = [];
    const whereClauses: string[] = [];

    // 1. Повнотекстовий пошук
    let orderBy = 'u."createdAt" DESC';
    let rankSelect = '0 AS rank';

    if (q) {
      const escapedQ = q.replace(/'/g, "''");
      params.push(`${escapedQ}:*`);
      const pIdx = params.length;

      whereClauses.push(
        `u.search_vector @@ (to_tsquery('english', $${pIdx}) || to_tsquery('russian', $${pIdx}))`,
      );
      rankSelect = `ts_rank_cd(u.search_vector, (to_tsquery('english', $${pIdx}) || to_tsquery('russian', $${pIdx}))) AS rank`;
      orderBy = 'rank DESC, u."createdAt" DESC';
    }

    // 2. Фільтр за ролями (ANY працює з масивами)
    if (roles) {
      let roleIds = Array.isArray(roles) ? roles : roles.split(',');
      params.push(roleIds);
      whereClauses.push(`r.id = ANY($${params.length})`);
    }

    // 3. Фільтр за групами
    if (academic_groups) {
      let groupIds = Array.isArray(academic_groups)
        ? academic_groups
        : academic_groups.split(',');
      params.push(groupIds);
      whereClauses.push(`ag.id = ANY($${params.length})`);
    }

    const whereSql =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Використовуємо jsonb_agg та jsonb_build_object для підтримки DISTINCT
    const sql = `
    SELECT
        u.id,
        u.email,
        u."firstName",
        u."lastName",
        u."avatarUrl",
        u."createdAt",
        ${rankSelect},
        COALESCE(
          (SELECT jsonb_agg(DISTINCT jsonb_build_object('id', r.id, 'name', r.name, 'slug', r.slug))
           FROM role r
           JOIN user_role ur ON ur."roleId" = r.id
           WHERE ur."userId" = u.id), '[]'
        ) AS roles,
        COALESCE(
          (SELECT jsonb_agg(DISTINCT jsonb_build_object('id', ag.id, 'name', ag.name, 'slug', ag.slug))
           FROM academic_group ag
           JOIN user_academic_group uag ON uag."academicGroupId" = ag.id
           WHERE uag."userId" = u.id), '[]'
        ) AS academic_groups
    FROM "user" u
    -- Робимо JOIN тільки якщо потрібна фільтрація, щоб не роздувати основний запит
    ${roles ? 'LEFT JOIN user_role ur_filter ON ur_filter."userId" = u.id LEFT JOIN role r ON r.id = ur_filter."roleId"' : ''}
    ${academic_groups ? 'LEFT JOIN user_academic_group uag_filter ON uag_filter."userId" = u.id LEFT JOIN academic_group ag ON ag.id = uag_filter."academicGroupId"' : ''}
    ${whereSql}
    GROUP BY u.id
    ORDER BY ${orderBy}
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `;

    const finalParams = [...params, limit, skip];

    const countSql = `
    SELECT COUNT(DISTINCT u.id) as total
    FROM "user" u
    ${roles ? 'LEFT JOIN user_role ur_filter ON ur_filter."userId" = u.id LEFT JOIN role r ON r.id = ur_filter."roleId"' : ''}
    ${academic_groups ? 'LEFT JOIN user_academic_group uag_filter ON uag_filter."userId" = u.id LEFT JOIN academic_group ag ON ag.id = uag_filter."academicGroupId"' : ''}
    ${whereSql}
  `;

    try {
      const [data, countResult] = await Promise.all([
        this.userRepository.query(sql, finalParams),
        this.userRepository.query(countSql, params),
      ]);

      return {
        results: data,
        total: Number(countResult[0]?.total || 0),
        page: +page,
        limit,
      };
    } catch (e) {
      console.error('SQL Error:', e);
      throw new Error('Database query failed');
    }
  }

  // ------------------------------------------------------

  //   async search(query: SearchQueryDto) {
  //     if (!query.q) {
  //       return [];
  //     }
  //     const escaped = query.q.replace(/'/g, "''");

  //     if (!escaped) {
  //       return [];
  //     }

  //     const take =
  //       +query.limit || +this.configService.get('DEFAULT_PAGE_SIZE') || 10;
  //     const page = +query.page || 1;
  //     const skip = (+page - 1 || 0) * take;

  //     // --!!!!!!!!!!!!!!! РАБОЧИЙ только совпадение с началом строки !!!!!!!!!!!!!!!!!!!!!!!!
  //     // добавляем * для частичного совпадения
  //     const tsQueryEnglish = `to_tsquery('english', '${escaped}:*')`;
  //     const tsQueryRussian = `to_tsquery('russian', '${escaped}:*')`;

  //     // --------------------- Возврат всего пользователя
  //     // const sql = `
  //     // 	SELECT
  //     // 	"user".*,
  //     // 	ts_rank_cd(
  //     // 		"user"."search_vector",
  //     // 		${tsQueryEnglish} || ${tsQueryRussian}
  //     // 	) AS rank
  //     // 	FROM "user"
  //     // 	WHERE "user"."search_vector" @@ (${tsQueryEnglish} || ${tsQueryRussian})
  //     // 	ORDER BY rank DESC;
  //     // `;

  //     // --------------------- Возврат выбраных полей пользователя (роли и академ_группы просто масив id)
  //     // const sql = `
  //     // 	SELECT
  //     // 		u.id AS user_id,
  //     // 		u."firstName" AS firstName,
  //     // 		u."lastName" AS lastName,
  //     // 		u."email" AS email,
  //     // 		COALESCE(json_agg(DISTINCT r.id) FILTER (WHERE r.id IS NOT NULL), '[]') AS roles,
  //     // 		COALESCE(json_agg(DISTINCT ag.id) FILTER (WHERE ag.id IS NOT NULL), '[]') AS academic_groups,
  //     // 		ts_rank_cd(u.search_vector, ${tsQueryEnglish} || ${tsQueryRussian}) AS rank
  //     // 	FROM "user" u
  //     // 	LEFT JOIN user_role ur ON ur."userId" = u.id
  //     // 	LEFT JOIN role r ON r.id = ur."roleId"
  //     // 	LEFT JOIN user_academic_group uag ON uag."userId" = u.id
  //     // 	LEFT JOIN academic_group ag ON ag.id = uag."academicGroupId"
  //     // 	WHERE u.search_vector @@ (${tsQueryEnglish} || ${tsQueryRussian})
  //     // 	GROUP BY u.id
  //     // 	ORDER BY rank DESC;
  //     // `;

  //     const sql = `
  // 			SELECT
  // 				u.id AS id,
  // 				u."firstName" AS firstName,
  // 				u."lastName" AS lastName,
  // 				COALESCE(
  // 				json_agg(
  // 					json_build_object(
  // 					'id', r.id,
  // 					'name', r.name,
  // 					'slug', r.slug
  // 					)
  // 				) FILTER (WHERE r.id IS NOT NULL),
  // 				'[]'
  // 				) AS roles,
  // 				COALESCE(
  // 				json_agg(
  // 					json_build_object(
  // 					'id', ag.id,
  // 					'name', ag.name,
  // 					'slug', ag.slug
  // 					)
  // 				) FILTER (WHERE ag.id IS NOT NULL),
  // 				'[]'
  // 				) AS academic_groups,
  // 				ts_rank_cd(u.search_vector, ${tsQueryEnglish} || ${tsQueryRussian}) AS rank
  // 			FROM "user" u
  // 			LEFT JOIN user_role ur ON ur."userId" = u.id
  // 			LEFT JOIN role r ON r.id = ur."roleId"
  // 			LEFT JOIN user_academic_group uag ON uag."userId" = u.id
  // 			LEFT JOIN academic_group ag ON ag.id = uag."academicGroupId"
  // 			WHERE u.search_vector @@ (${tsQueryEnglish} || ${tsQueryRussian})
  // 			GROUP BY u.id
  // 			ORDER BY rank DESC
  // 			LIMIT $1
  // 			OFFSET $2
  // 		`;

  //     const countSql = `
  // 			SELECT COUNT(*) AS total
  // 			FROM "user" u
  // 			WHERE u.search_vector @@ (${tsQueryEnglish} || ${tsQueryRussian});
  // 		`;

  //     const [data, countResult] = await Promise.all([
  //       this.userRepository.query(sql, [take, skip]),
  //       this.userRepository.query(countSql),
  //     ]);

  //     // return [data, Number(countResult[0].total)]
  //     return {
  //       results: data,
  //       total: Number(countResult[0].total),
  //       page,
  //       limit: take,
  //     };

  //     // --!!!!!!!!!!!!!!! РАБОЧИЙ совпадение с любой частью строки НО работает без миграции тоесть поиск без настроек полнотекстового поиска по индексам, будет искать дольше при большой базе данных!!!!!!!!!!!!!!!!!!!!!!!!
  //     // return this.userRepository
  //     // 	.createQueryBuilder("user")
  //     // 	.leftJoinAndSelect("user.roles", "role")
  //     // 	.leftJoinAndSelect("user.academic_groups", "academ_group")
  //     // 	.select([
  //     // 		"user.id",
  //     // 		"user.firstName",
  //     // 		"user.lastName",
  //     // 		"role.id",
  //     // 		"academ_group.id"
  //     // 	])
  //     // 	.where(`
  //     // 		"user"."firstName" ILIKE :q
  //     // 		OR "user"."lastName" ILIKE :q
  //     // 		OR "user"."email" ILIKE :q
  //     // 	`, { q: `%${query}%` })
  //     // 	.getMany();
  //   }
}
