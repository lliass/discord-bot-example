import { IsNotEmpty, IsDateString } from 'class-validator';

class GetReportHoursRequestDTO {
  @IsNotEmpty()
  @IsDateString()
  startDate: string;
  @IsNotEmpty()
  @IsDateString()
  endDate: string;
}

interface TrackingDetail {
  date: string;
  workedHours: number;
  valueOfWorkedHours: number;
}

interface Report {
  discordName: string;
  monitorName: string;
  totalWorkedHours: number;
  billedHours: number;
  trackingDetails: TrackingDetail[];
}

interface IGetReportHoursResponseDTO {
  reports: Report[];
}

export { GetReportHoursRequestDTO, IGetReportHoursResponseDTO, Report };
