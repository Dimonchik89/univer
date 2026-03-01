export class CreateScheduleTableDto {
  tableId: string;
  indexBeginningDaysOfWeekInTable: {
    Monday: 7;
    Tuesday: 21;
    Wednesday: 35;
    Thursday: 49;
    Friday: 63;
  };
  groupRowIndex: 6;
}
