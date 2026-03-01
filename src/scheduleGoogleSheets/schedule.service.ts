import { google, sheets_v4 } from 'googleapis';
import { join } from 'path';
import { allScheduleTablesInfo } from './constants/schedule.constants';
import { ParsedSchedule, ScheduleTableInfo, WeekDay } from '../types/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { AcademicGroup } from '../academic-group/entities/academic-group.entity';
import { Repository } from 'typeorm';
import { ScheduleLesson } from './entities/schedule.entity';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AcademicGroupService } from '../academic-group/academic-group.service';
import { ScheduleTable } from './entities/schedule-table.entity';
import { CreateScheduleTableDto } from './dto/create-schedule-table.dto';
import { UpdateScheduleTableDto } from './dto/update-schedule-table.dto';

type LessonColor = 'red' | 'green' | 'black';

interface ParsedLesson {
  title: string;
  color: LessonColor;
  link?: string;
}

@Injectable()
export class ScheduleGoogleSheetService {
  private sheets: sheets_v4.Sheets;

  constructor(
    @InjectRepository(AcademicGroup)
    private academicGroupRepository: Repository<AcademicGroup>,
    @InjectRepository(ScheduleTable)
    private scheduleTableRepository: Repository<ScheduleTable>,
    @InjectRepository(ScheduleLesson)
    private scheduleLessonRepository: Repository<ScheduleLesson>,
    private readonly academicGroupService: AcademicGroupService,
  ) {
    const auth = new google.auth.GoogleAuth({
      keyFile: join(process.cwd(), 'google-credentials.json'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
  }

  async createScheduleTable(dto: CreateScheduleTableDto) {
    const scheduleTableExists = await this.scheduleTableRepository.findOne({
      where: {
        tableId: dto.tableId,
      },
    });

    if (scheduleTableExists) {
      throw new BadRequestException('a table with such an ID exists');
    }

    const scheduleTable = await this.scheduleTableRepository.create({
      tableId: dto.tableId,
      groupRowIndex: dto.groupRowIndex,
      indexBeginningDaysOfWeekInTable: JSON.stringify(
        dto.indexBeginningDaysOfWeekInTable,
      ),
    });

    const savedScheduleTable =
      await this.scheduleTableRepository.save(scheduleTable);

    return savedScheduleTable;
  }

  async updateScheduleTable(dto: UpdateScheduleTableDto) {
    const scheduleTableExists = await this.scheduleTableRepository.findOne({
      where: {
        tableId: dto.tableId,
      },
    });

    if (!scheduleTableExists) {
      throw new NotFoundException('Table not found');
    }

    const body = {
      tableId: dto.tableId,
      indexBeginningDaysOfWeekInTable: JSON.stringify(
        dto.indexBeginningDaysOfWeekInTable,
      ),
      groupRowIndex: dto.groupRowIndex,
    };

    await this.scheduleTableRepository.update(scheduleTableExists.id, body);
    return await this.scheduleTableRepository.findOne({
      where: { tableId: scheduleTableExists.id },
    });
  }

  async deleteScheduleTable(tableId: string) {
    const scheduleTableExists = await this.scheduleTableRepository.findOne({
      where: { id: tableId },
    });

    if (!scheduleTableExists) {
      throw new NotFoundException('Table not found');
    }

    const result = await this.scheduleTableRepository.delete({ id: tableId });

    if (result.affected === 0) {
      throw new NotFoundException(`Table ${tableId} not found`);
    }

    return { id: tableId, success: true };
  }

  async getOneScheduleTable(tableId: string) {
    const scheduleTableExists = await this.scheduleTableRepository.findOne({
      where: { id: tableId },
    });

    if (!scheduleTableExists) {
      throw new NotFoundException('Table not found');
    }

    return scheduleTableExists;
  }

  async getAllScheduleTables(params: { page: string; limit: string }) {
    const baseQuery =
      await this.scheduleTableRepository.createQueryBuilder('schedule_table');

    const limit = +params.limit || 10;
    const page = +params.page || 1;
    const skip = (page - 1) * limit;

    const totalQuery = await baseQuery.clone();
    const uniqueResult = await totalQuery.select('schedule_table.id').getMany();

    const totalCount = uniqueResult.length;

    const results = await baseQuery
      .orderBy('schedule_table.createdAt', 'DESC')
      .limit(limit)
      .offset(skip)
      .getMany();

    return {
      results,
      total: totalCount,
      page,
      limit,
    };
  }

  async getScheduleGroup(groupId) {
    const lessons = await this.scheduleLessonRepository.find({
      where: {
        academicGroup: {
          name: groupId,
        },
      },
      order: {
        lessonNumber: 'ASC',
      },
    });

    if (!lessons.length) {
      throw new NotFoundException('Schedule not found');
    }

    const grouped = lessons.reduce(
      (acc, lesson) => {
        const day = lesson.dayOfWeek;

        if (!acc[day]) {
          acc[day] = [];
        }

        acc[day].push(lesson);

        return acc;
      },
      {} as Record<string, typeof lessons>,
    );

    return grouped;
  }

  async syncFromParsed(parsed: ParsedSchedule) {
    for (const groupData of parsed.groups) {
      let group = await this.academicGroupRepository.findOne({
        where: { name: groupData.name },
      });

      if (!group) {
        // group = this.academicGroupRepository.create({
        //   name: groupData.name,
        // });
        // await this.academicGroupRepository.save(group);
        group = await this.academicGroupService.create({
          name: groupData.name,
        });
      }

      await this.scheduleLessonRepository.delete({
        academicGroup: { id: group.id },
      });

      const groupSchedule = parsed.schedules[group.name] || {};

      for (const [day, lessons] of Object.entries(groupSchedule)) {
        for (const lesson of lessons) {
          const dayEnum = day.toLowerCase() as WeekDay;

          const scheduleEntity = this.scheduleLessonRepository.create({
            lesson: lesson.lesson,
            lessonType: lesson.lesson_type,
            lessonNumber: lesson.lesson_number,
            color: lesson.color,
            link: lesson.link,
            portal: lesson.portal,
            dayOfWeek: dayEnum,
            academicGroup: group,
          });

          await this.scheduleLessonRepository.save(scheduleEntity);
        }
      }
    }
  }

  async parseAllTables() {
    // const res = allScheduleTablesInfo.map(async (table) => {
    //   const parsed = await this.parse(table);
    //   return await this.syncFromParsed(parsed);
    // });
    // await Promise.all(res);

    const tables = await this.scheduleTableRepository.find();

    const resultPromises = tables.map(async (table) => {
      const indexBeginningDaysOfWeekInTable = JSON.parse(
        table.indexBeginningDaysOfWeekInTable,
      );

      const body = {
        id: table.tableId,
        indexBeginningDaysOfWeekInTable: {
          Monday: +indexBeginningDaysOfWeekInTable.Monday,
          Tuesday: indexBeginningDaysOfWeekInTable.Tuesday,
          Wednesday: indexBeginningDaysOfWeekInTable.Wednesday,
          Thursday: indexBeginningDaysOfWeekInTable.Thursday,
          Friday: indexBeginningDaysOfWeekInTable.Friday,
          Saturday: indexBeginningDaysOfWeekInTable?.Saturday,
        },
        groupRowIndex: table.groupRowIndex,
      };

      const parsed = await this.parse(body);
      return await this.syncFromParsed(parsed);
    });

    await Promise.all(resultPromises);

    return { message: 'Schedule updated' };
  }

  // ====== ПАРСИНГ ВСЕЙ ТАБЛИЦЫ ======
  async parse(table: ScheduleTableInfo): Promise<ParsedSchedule> {
    const spreadsheet = await this.sheets.spreadsheets.get({
      spreadsheetId: table.id,
      includeGridData: true,
    });

    const groups = new Set<string>();
    const schedules: Record<string, any> = {};

    const dayMap = {
      понеділок: 'Monday',
      вівторок: 'Tuesday',
      середа: 'Wednesday',
      четвер: 'Thursday',
      "п'ятниця": 'Friday',
      субота: 'Saturday',
    };

    const dayStartRows = table.indexBeginningDaysOfWeekInTable;

    for (const sheet of spreadsheet.data.sheets || []) {
      const grid = sheet.data?.[0];
      if (!grid?.rowData) continue;
      const rows = grid.rowData;
      const merges = sheet.merges || [];

      // ====== Получаем группы ======
      const groupRowIndex = table.groupRowIndex; // строка с названиями групп (index 5 = 6 строка)
      const groupRow = rows[groupRowIndex];
      const groupColumns: Record<string, number[]> = {}; // для merged cells

      for (let col = 3; col < (groupRow.values?.length || 0); col++) {
        const name = groupRow.values?.[col]?.formattedValue?.trim();
        if (!name) continue;

        // ищем merged range для этой колонки
        const mergedCols = merges
          .filter(
            (m) =>
              m.startRowIndex === groupRowIndex &&
              m.startColumnIndex <= col &&
              m.endColumnIndex > col,
          )
          .map((m) => {
            const arr = [];
            for (let i = m.startColumnIndex; i < m.endColumnIndex; i++)
              arr.push(i);
            return arr;
          })
          .flat();

        groupColumns[name] = mergedCols.length ? mergedCols : [col];
        groups.add(name);

        if (!schedules[name]) {
          schedules[name] = {
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: [],
          };
        }
      }

      // ====== Парсим расписание ======

      for (const [dayName, startRow] of Object.entries(dayStartRows)) {
        const orderedDays = Object.entries(dayStartRows).sort(
          (a, b) => a[1] - b[1],
        );

        for (let pair = 0; pair < orderedDays.length; pair++) {
          const rowIndex1 = startRow + pair * 2;
          const rowIndex2 = startRow + pair * 2 + 1;

          const rowsToCheck = [rows[rowIndex1], rows[rowIndex2]];

          for (const row of rowsToCheck) {
            if (!row?.values) continue;

            for (let colIndex = 0; colIndex < row.values.length; colIndex++) {
              const cell = row.values[colIndex];
              if (!cell) continue;

              const text = cell.formattedValue?.trim();
              const hasLink = !!cell.hyperlink;

              // пропускаем чистые ссылки
              if (hasLink && text === cell.hyperlink) {
                continue;
              }

              // пропускаем пустые ячейки
              if (!text) continue;

              // пропускаем сам "Портал" как отдельное занятие
              if (text.toLowerCase() === 'портал') {
                continue;
              }

              if (text.toLowerCase().includes('ссылка приглашения')) {
                continue;
              }

              const color = this.detectColor(cell);

              // ищем merge диапазон
              const merge = merges.find(
                (m) =>
                  m.startRowIndex <= rowIndex1 &&
                  m.endRowIndex > rowIndex1 &&
                  m.startColumnIndex <= colIndex &&
                  m.endColumnIndex > colIndex,
              );

              const startCol = merge ? merge.startColumnIndex : colIndex;
              const endCol = merge ? merge.endColumnIndex : colIndex + 1;

              // читаем соседнюю колонку (метаданные)
              const infoCell = row.values[endCol];

              let link: string | null = null;
              let portal: boolean = false;

              //   Меняю из-за Ссылка приглашения
              //   if (infoCell) {
              //     if (infoCell.hyperlink) {
              //       link = infoCell.hyperlink;
              //     }

              //     const infoText = infoCell.formattedValue?.trim().toLowerCase();
              //     if (infoText === 'портал') {
              //       portal = true;
              //     }
              //   }

              if (infoCell) {
                const infoText =
                  infoCell.formattedValue?.trim().toLowerCase() || '';

                if (infoText === 'портал') {
                  portal = true;
                }

                // if (infoText.includes('ссылка приглашения')) {
                //   console.log(
                //     `infoText - ${infoText}`,
                //     `hyperlink - ${infoCell.hyperlink}`,
                //   );
                // }

                if (
                  infoCell.hyperlink &&
                  (!infoText || infoText.includes('ссылка приглашения'))
                ) {
                  link = infoCell.hyperlink;
                }
              }

              // распределяем по группам
              for (const [groupName, groupCols] of Object.entries(
                groupColumns,
              )) {
                const belongs = groupCols.some(
                  (gCol) => gCol >= startCol && gCol < endCol,
                );

                if (!belongs) continue;

                schedules[groupName][dayName].push({
                  lesson: text,
                  lesson_type: this.detectLessonType(text),
                  color,
                  lesson_number: pair + 1,
                  link,
                  portal,
                });
              }

              // перескакиваем через обработанный диапазон
              colIndex = endCol - 1;
            }
          }
        }
      }
    }

    return {
      groups: Array.from(groups).map((name, index) => ({
        id: index + 1,
        name,
      })),
      schedules,
    };
  }

  // ====== Определяем цвет ======
  private detectColor(cell: sheets_v4.Schema$CellData): LessonColor {
    const color = cell.effectiveFormat?.textFormat?.foregroundColor;

    if (!color) return 'black';
    if ((color.red || 0) > 0.8) return 'red';
    if ((color.green || 0) > 0.5) return 'green';
    return 'black';
  }

  // ====== Тип занятия ======
  private detectLessonType(title: string): string {
    const lower = title.toLowerCase();
    if (lower.includes('лек')) return 'lecture';
    if (lower.includes('прак')) return 'practice';
    if (lower.includes('лаб')) return 'lab';
    return 'lecture';
  }

  // ====== Получаем список групп ======
  async getGroups(table: ScheduleTableInfo) {
    const parsed = await this.parse(table);
    return parsed.groups.map((item) => ({ name: item.name }));
  }

  // ====== Получаем расписание для группы ======
  async getScheduleForGroup(table: ScheduleTableInfo, group: string) {
    const parsed = await this.parse(table);

    return {
      ok: true,
      group: {
        name: group,
      },
      schedule: parsed.schedules[group] || {},
    };
  }
}

// --------------------------------!!!!!!!!!!!!!!!!!!!!!!!!!!!!
