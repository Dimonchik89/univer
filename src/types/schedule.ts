export interface ScheduleTableInfo {
  id: string;
  indexBeginningDaysOfWeekInTable: {
    Monday: number;
    Tuesday: number;
    Wednesday: number;
    Thursday: number;
    Friday: number;
    Saturday?: number;
  };
  groupRowIndex: number;
}

export enum WeekDay {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
}

export interface ScheduleTable {
  color: string;
  lesson: string;
  lesson_number: number;
  lesson_type: string;
  link: string | null;
  portal: boolean;
}

export interface ParsedSchedule {
  groups: {
    name: string;
  }[];
  schedules: Record<string, Partial<Record<WeekDay, ScheduleTable[]>>>;
}
