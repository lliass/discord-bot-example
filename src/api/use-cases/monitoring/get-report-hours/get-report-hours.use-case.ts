import {
  IAccountingMonitorRepository,
  ACCOUNTING_MONITOR_REPOSITORY_TYPE,
} from '../../../../shared/databases/mongo-db/accounting-monitor/Iaccounting-monitor.repository';
import {
  IMonitorRepository,
  MONITOR_REPOSITORY_TYPE,
} from '../../../../shared/databases/mongo-db/monitor/Imonitor.repository';
import { IGetReportHoursUseCase } from './interfaces';
import { injectable, inject } from 'inversify';
import {
  GetReportHoursRequestDTO,
  IGetReportHoursResponseDTO,
  Report,
} from './get-report-hours.dto';
import { BadRequest } from 'http-errors';
import { format } from 'date-fns';

@injectable()
export default class GetReportHoursCase implements IGetReportHoursUseCase {
  specifications = {
    monitoringPaymentLimit: 90,
    valueOfMonitoringHour: 30,
  };

  @inject(ACCOUNTING_MONITOR_REPOSITORY_TYPE)
  private accountingMonitorRepository: IAccountingMonitorRepository;

  @inject(MONITOR_REPOSITORY_TYPE)
  private monitorRepository: IMonitorRepository;

  async execute(
    params: GetReportHoursRequestDTO,
  ): Promise<IGetReportHoursResponseDTO> {
    const { startDate, endDate } = params;

    const endDateIsLessThenStartDate = new Date(startDate) > new Date(endDate);

    if (endDateIsLessThenStartDate)
      throw new BadRequest('endDate can`t be less then startDate');

    const monitoringDocuments =
      await this.accountingMonitorRepository.findByRangeDate({
        startDate: new Date(`${startDate} 00:00:00`),
        endDate: new Date(`${endDate} 00:00:00`),
      });

    const doesNotExistMonitoringDocumentsBetweenTheseDatesRange =
      monitoringDocuments.length === 0;

    if (doesNotExistMonitoringDocumentsBetweenTheseDatesRange)
      throw new BadRequest(
        'Does not exist monitoring documents between these dates range',
      );

    const { monitoringPaymentLimit, valueOfMonitoringHour } =
      this.specifications;

    const monitorDiscordInformations = await this.monitorRepository.find();

    const reportsBasedOnTheRangeDate = monitoringDocuments.reduce(
      (reports: Report[], monitoringDocument) => {
        const { creationDate, monitors } = monitoringDocument;

        const monitorDiscordNames = Object.keys(monitors);

        for (const monitorDiscordName of monitorDiscordNames) {
          const entryAndExistExistToCreateReport =
            monitors[monitorDiscordName].firstEntry &&
            monitors[monitorDiscordName].lastExit;

          if (entryAndExistExistToCreateReport) {
            const monitorFirstEntry = `${monitors[monitorDiscordName].firstEntry}`;
            const monitorLastExit = `${monitors[monitorDiscordName].lastExit}`;

            const monitorFirstEntryInMilliseconds = new Date(
              monitorFirstEntry,
            ).getTime();
            const monitorLastExitInMilliseconds = new Date(
              monitorLastExit,
            ).getTime();

            const diferenceInMillisecondsBetweenEntryAndExit =
              monitorLastExitInMilliseconds - monitorFirstEntryInMilliseconds;

            const totalSeconds = Math.floor(
              diferenceInMillisecondsBetweenEntryAndExit / 1000,
            );

            const totalWorkedHours = Math.floor(totalSeconds / 3600);

            const totalWorkedMinutes = Math.floor((totalSeconds % 3600) / 60);

            const totalWorkedTime = +(
              totalWorkedHours +
              totalWorkedMinutes / 60
            ).toFixed(2);

            const totalAmountValue = totalWorkedTime * valueOfMonitoringHour;

            const amountToBePaid = +(
              totalAmountValue > monitoringPaymentLimit
                ? monitoringPaymentLimit
                : totalAmountValue
            ).toFixed(2);

            const reportFound = reports.find(
              (report) => report?.discordName === monitorDiscordName,
            );

            const formattedMonitoringDate = format(creationDate, 'yyyy-MM-dd');

            if (reportFound) {
              reportFound.totalWorkedHours = +(
                reportFound.totalWorkedHours + totalWorkedTime
              ).toFixed(2);
              reportFound.billedHours += amountToBePaid;
              reportFound.trackingDetails.push({
                date: formattedMonitoringDate,
                workedHours: totalWorkedTime,
                valueOfWorkedHours: amountToBePaid,
              });
            } else {
              const monitorDiscordInformation = monitorDiscordInformations.find(
                (monitorDiscordInformation) =>
                  monitorDiscordInformation.nickname === monitorDiscordName,
              );

              const monitorsName = !!monitorDiscordInformation
                ? monitorDiscordInformation.name
                : '';

              const report: Report = {
                discordName: monitorDiscordName,
                monitorName: monitorsName,
                totalWorkedHours: totalWorkedTime,
                billedHours: amountToBePaid,
                trackingDetails: [
                  {
                    date: formattedMonitoringDate,
                    workedHours: totalWorkedTime,
                    valueOfWorkedHours: amountToBePaid,
                  },
                ],
              };

              reports.push(report);
            }
          }
        }

        return reports;
      },
      [],
    );

    return {
      reports: reportsBasedOnTheRangeDate,
    };
  }
}
