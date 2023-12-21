import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';
import { injectable } from 'inversify';

@injectable()
export default class DateHelper {
  public getFormattedDateFromAmericaSaoPaulo(currentDate: Date): Date {
    const brasiliaTimeZone = 'America/Sao_Paulo';

    const dateTimeUTC = zonedTimeToUtc(currentDate, brasiliaTimeZone);

    const dateTimeBrasiliaObject = utcToZonedTime(
      dateTimeUTC,
      brasiliaTimeZone,
    );

    return dateTimeBrasiliaObject;
  }

  public formatDate(currentDate: Date): string {
    return format(currentDate, 'yyyy-MM-dd HH:mm:ss');
  }
}
