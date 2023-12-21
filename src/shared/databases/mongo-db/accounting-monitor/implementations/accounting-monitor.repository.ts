import { MongoRepository } from 'typeorm';
import { MongoDataSource } from '../../data-source';
import { AccountingMonitor } from './accounting-monitor.entity';
import { IAccountingMonitorRepository } from '../Iaccounting-monitor.repository';
import { injectable } from 'inversify';

@injectable()
export default class AccountingMonitorRepository
  implements IAccountingMonitorRepository
{
  private repository: MongoRepository<AccountingMonitor>;

  constructor() {
    this.repository = MongoDataSource.getMongoRepository(AccountingMonitor);
  }

  async findAll(): Promise<AccountingMonitor[]> {
    const result = await this.repository.find();

    return result;
  }

  async saveOne(payload: Partial<AccountingMonitor>): Promise<void> {
    await this.repository.save(payload);
  }

  async findOne(
    payload: Partial<AccountingMonitor>,
  ): Promise<AccountingMonitor | null> {
    const result = await this.repository.findOne({
      where: { ...payload },
    });

    return result;
  }

  async updateOne(params: {
    objectId: number;
    payload: Partial<AccountingMonitor>;
  }): Promise<boolean> {
    const { objectId, payload } = params;

    const result = await this.repository.update(objectId, payload);

    return !!result.affected;
  }

  async findByRangeDate(params: {
    startDate: Date;
    endDate: Date;
  }): Promise<AccountingMonitor[]> {
    const { startDate, endDate } = params;

    const result = await this.repository.find({
      where: {
        creationDate: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    });

    return result;
  }
}
