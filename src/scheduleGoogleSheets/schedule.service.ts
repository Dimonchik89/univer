import { google, sheets_v4 } from 'googleapis';
import { join } from 'path';
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
import {
  SCHEDULE_TABLE_ALREADY_EXIST,
  SCHEDULE_TABLE_NOT_FOUND,
} from './constants/schedule.constants';

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
      throw new BadRequestException(SCHEDULE_TABLE_ALREADY_EXIST);
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

  async updateScheduleTable(id: string, dto: UpdateScheduleTableDto) {
    const scheduleTableExists = await this.scheduleTableRepository.findOne({
      where: {
        id,
      },
    });

    if (!scheduleTableExists) {
      throw new NotFoundException(SCHEDULE_TABLE_NOT_FOUND);
    }

    const body = {
      tableId: dto.tableId,
      indexBeginningDaysOfWeekInTable: JSON.stringify(
        dto.indexBeginningDaysOfWeekInTable,
      ),
      groupRowIndex: dto.groupRowIndex,
    };

    await this.scheduleTableRepository.update(scheduleTableExists.id, body);
    const result = await this.scheduleTableRepository.findOne({
      where: { id: scheduleTableExists.id },
    });

    return result;
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

  async getScheduleGroup(groupName) {
    const lessons = await this.scheduleLessonRepository.find({
      where: {
        academicGroup: {
          name: groupName,
        },
      },
      order: {
        lessonNumber: 'ASC',
      },
    });

    if (!lessons.length) {
      throw new NotFoundException(SCHEDULE_TABLE_NOT_FOUND);
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
    const dayStartRows = table.indexBeginningDaysOfWeekInTable;

    for (const sheet of spreadsheet.data.sheets || []) {
      const grid = sheet.data?.[0];
      if (!grid?.rowData) continue;
      
      const rows = grid.rowData;
      const merges = sheet.merges || [];
      const groupRowIndex = table.groupRowIndex;
      const groupRow = rows[groupRowIndex];
      const groupColumns: Record<string, number[]> = {};

      // 1. Визначаємо колонки для груп (з урахуванням Merge)
      if (!groupRow?.values) continue;

      for (let col = 3; col < groupRow.values.length; col++) {
        const name = groupRow.values[col]?.formattedValue?.trim();
        if (!name) continue;

        const merge = merges.find(m => 
          m.startRowIndex <= groupRowIndex && m.endRowIndex > groupRowIndex &&
          m.startColumnIndex <= col && m.endColumnIndex > col
        );

        const cols = [];
        if (merge) {
          for (let i = merge.startColumnIndex; i < merge.endColumnIndex; i++) cols.push(i);
          col = merge.endColumnIndex - 1; // Стрибаємо в кінець мержу
        } else {
          cols.push(col);
        }

        groupColumns[name] = cols;
        groups.add(name);
        schedules[name] = { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [] };
      }

      // 2. Парсимо дні
      for (const [dayName, startRow] of Object.entries(dayStartRows)) {
        if (startRow === null || startRow === undefined || startRow == 0) continue;

        const maxPairs = 7;
        for (let pair = 0; pair < maxPairs; pair++) {
          // Кожна пара займає 2 рядки (чисельник/знаменник)
          const rowIdxs = [Number(startRow) + pair * 2, Number(startRow) + pair * 2 + 1];

          for (const rIdx of rowIdxs) {
            const currentRow = rows[rIdx];
            if (!currentRow?.values) continue;
            

            for (let cIdx = 3; cIdx < currentRow.values.length; cIdx++) {
              const cell = currentRow.values[cIdx];
              const text = cell?.formattedValue?.trim();

              
              
              if (!text || text.toLowerCase() === 'портал' || text.includes('http')) continue;

              // Знаходимо мерж поточної комірки заняття
              const cellMerge = merges.find(m => 
                m.startRowIndex <= rIdx && m.endRowIndex > rIdx &&
                m.startColumnIndex <= cIdx && m.endColumnIndex > cIdx
              );

              const startCol = cellMerge ? cellMerge.startColumnIndex : cIdx;
              const endCol = cellMerge ? cellMerge.endColumnIndex : cIdx + 1;

              // Шукаємо посилання/портал у наступній доступній колонці ПІСЛЯ мержа
              const infoCell = currentRow.values[endCol];
              let link = infoCell?.hyperlink || null;
              let portal = infoCell?.formattedValue?.toLowerCase().includes('портал') || false;

              if (!link && !portal) {
                const otherRowIdx = rIdx === rowIdxs[0] ? rowIdxs[1] : rowIdxs[0];
                const otherRow = rows[otherRowIdx];

                if (otherRow?.values) {
                  const otherInfoCell = otherRow.values[endCol];

                  link = otherInfoCell?.hyperlink || link;
                  portal =
                    portal ||
                    otherInfoCell?.formattedValue?.toLowerCase().includes('портал') ||
                    false;
                }
              }

              if(dayName.toLowerCase() === "friday") {
                // console.log("FRIDAY", text, link, portal);
                console.log("FRIDAY", `rIdx: ${rIdx}`, `cIdx: ${cIdx}`, text, link);
              }

              const lessonData = {
                lesson: text,
                lesson_type: this.detectLessonType(text),
                color: this.detectColor(cell),
                lesson_number: pair + 1,
                link,
                portal,
              };

              // Розподіляємо заняття по групах, чиї колонки входять в діапазон мержа
              for (const [gName, gCols] of Object.entries(groupColumns)) {
                if (gCols.some(gc => gc >= startCol && gc <= startCol)) { // Перевірка початкової колонки мержа
                  // Уникаємо дублів в межах одного дня та одного номера пари
                  const isDuplicate = schedules[gName][dayName].some(l => 
                    l.lesson === lessonData.lesson && l.lesson_number === lessonData.lesson_number && lessonData.color === l.color
                  );

                  if (!isDuplicate) schedules[gName][dayName].push(lessonData);
                }
              }

              if (cellMerge) cIdx = cellMerge.endColumnIndex - 1;
            }
          }
        }
      }
    }

    return {
      groups: Array.from(groups).map((name, i) => ({ id: i + 1, name })),
      schedules,
    };
  }

  // ====== Определяем цвет ======
  private detectColor(cell: sheets_v4.Schema$CellData): LessonColor {
    const color = cell.effectiveFormat?.textFormat?.foregroundColor;

    if (!color) return 'black';
    if ((color.red || 0) > 0.8) return 'red';
    if ((color.green || 0) > 0.4) return 'green';
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
