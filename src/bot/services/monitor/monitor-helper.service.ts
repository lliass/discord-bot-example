import { format } from 'date-fns';
import DateHelper from '../../../shared/helpers/date.helper';
import { inject, injectable } from 'inversify';

interface IAccessLimits {
  limits: Record<'entry' | 'exit', string>;
}

@injectable()
export default class MonitorHelperService {
  constructor(@inject(DateHelper) private dateHelper: DateHelper) {}

  getTheEntryOrExitDateAccordingToTheTypeOfMonitorAccess(params: {
    accessOutOfTime: boolean;
    accessType: 'entry' | 'exit';
  }): string {
    const { accessOutOfTime, accessType } = params;

    const { limits }: IAccessLimits = {
      limits: {
        entry: '18:00:00',
        exit: '21:30:00',
      },
    };

    const accessLimit = limits[accessType];

    const entryDateToBeInsert = accessOutOfTime
      ? this.dateHelper.formatDate(new Date())
      : `${format(new Date(), 'yyyy-MM-dd')} ${accessLimit}`;

    return entryDateToBeInsert;
  }

  calculateHoursAndMinuteInTotal(params: {
    hours: number;
    minutes: number;
  }): number {
    const { hours, minutes } = params;

    return hours * 60 + minutes;
  }

  getCurrentHoursAndMinutes(currentDate: Date): {
    currentHours: number;
    currentMinutes: number;
  } {
    const [currentHours, currentMinutes] = [
      currentDate.getHours(),
      currentDate.getMinutes(),
    ];

    return { currentHours, currentMinutes };
  }
}
