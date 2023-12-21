import { IAccountingMonitor } from './Iaccounting-monitor.entity';

interface IAccountingMonitorRepository {
  findAll(): Promise<IAccountingMonitor[]>;
  saveOne(payload: Partial<IAccountingMonitor>): Promise<void>;
  findOne(
    payload: Partial<IAccountingMonitor>,
  ): Promise<IAccountingMonitor | null>;
  updateOne(params: {
    objectId: number;
    payload: Partial<IAccountingMonitor>;
  }): Promise<boolean>;
  findByRangeDate(params: {
    startDate: Date;
    endDate: Date;
  }): Promise<IAccountingMonitor[]>;
}

const ACCOUNTING_MONITOR_REPOSITORY_TYPE = Symbol.for(
  'IAccountingMonitorRepository',
);

export { ACCOUNTING_MONITOR_REPOSITORY_TYPE, IAccountingMonitorRepository };
