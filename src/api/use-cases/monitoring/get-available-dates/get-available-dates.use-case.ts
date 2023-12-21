import {
  IAccountingMonitorRepository,
  ACCOUNTING_MONITOR_REPOSITORY_TYPE,
} from '../../../../shared/databases/mongo-db/accounting-monitor/Iaccounting-monitor.repository';
import { IGetAvailableDatesUseCase } from './interfaces';
import { injectable, inject } from 'inversify';
import { IGetAvailableDatesResponseDTO } from './get-available-dates.dto';
import { NotFound } from 'http-errors';
import { format } from 'date-fns';

@injectable()
export default class GetAvailableDatesUseCase
  implements IGetAvailableDatesUseCase
{
  @inject(ACCOUNTING_MONITOR_REPOSITORY_TYPE)
  private accountingMonitorRepository: IAccountingMonitorRepository;

  async execute(): Promise<IGetAvailableDatesResponseDTO> {
    const monitoringDocuments =
      await this.accountingMonitorRepository.findAll();

    const doesNotExistEnoughItems =
      !monitoringDocuments || monitoringDocuments.length === 1;

    if (doesNotExistEnoughItems)
      throw new NotFound('Does not exist enough dates');

    const firstAvailableDocument = monitoringDocuments[0];
    const lastAvailableDocument =
      monitoringDocuments[monitoringDocuments.length - 1];

    const formattedFirstAvailableDocument = format(
      firstAvailableDocument.creationDate,
      'yyyy-MM-dd',
    );

    const formattedLastAvailableDocument = format(
      lastAvailableDocument.creationDate,
      'yyyy-MM-dd',
    );

    return {
      availableDates: {
        startDate: formattedFirstAvailableDocument,
        endDate: formattedLastAvailableDocument,
      },
    };
  }
}
