import { IMonitor } from './Imonitor.entity';

interface IMonitorRepository {
  saveOne(payload: Partial<IMonitor>): Promise<IMonitor>;
  findOne(payload: Partial<IMonitor>): Promise<IMonitor | null>;
  updateOne(params: {
    objectId: number;
    payload: Partial<IMonitor>;
  }): Promise<boolean>;
  find(): Promise<IMonitor[]>;
}

const MONITOR_REPOSITORY_TYPE = Symbol.for('IMonitorRepository');

export { MONITOR_REPOSITORY_TYPE, IMonitorRepository };
