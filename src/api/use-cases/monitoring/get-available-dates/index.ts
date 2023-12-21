import container from '../../../../config/inversify.config';
import GetAvailableDatesController from './get-available-dates.controller';

export const getMonthsOfMonitoringController =
  container.get<GetAvailableDatesController>(GetAvailableDatesController);
