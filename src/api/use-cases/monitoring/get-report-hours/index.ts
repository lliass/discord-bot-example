import container from '../../../../config/inversify.config';
import GetReportHoursController from './get-report-hours.controller';

export const getReportHoursController = container.get<GetReportHoursController>(
  GetReportHoursController,
);
