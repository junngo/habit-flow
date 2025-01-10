import { IsString, IsEnum, IsNotEmpty, IsDateString, IsInt } from 'class-validator';

export class UpdateAttendanceDto {
  @IsDateString()
  date: string; // 출석 일자 (ISO 8601 포맷)

  @IsEnum(['COMPLETE', 'START', 'SKIP'])
  @IsNotEmpty()
  action: 'COMPLETE' | 'START' | 'SKIP'; // 액션 유형
}
