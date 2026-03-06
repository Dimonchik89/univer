import { ApiProperty } from '@nestjs/swagger';

export class IndexBeginningDaysOfWeekDto {
  @ApiProperty({ example: 7 })
  Monday: number;

  @ApiProperty({ example: 21 })
  Tuesday: number;

  @ApiProperty({ example: 35 })
  Wednesday: number;

  @ApiProperty({ example: 49 })
  Thursday: number;

  @ApiProperty({ example: 63 })
  Friday: number;
}
export class CreateScheduleTableDto {
  @ApiProperty({
    description: 'ID таблицi розкладу',
    example: '1j7KJcPazLt68EVPNF7ncrOyiO2Yq_lyQs5x746Yc6ec',
  })
  tableId: string;

  @ApiProperty({ type: () => IndexBeginningDaysOfWeekDto })
  indexBeginningDaysOfWeekInTable: IndexBeginningDaysOfWeekDto;

  @ApiProperty({ example: 6 })
  groupRowIndex: number;
}
