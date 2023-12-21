import { MongoRepository } from 'typeorm';
import { MongoDataSource } from '../../data-source';
import { Monitor } from './monitor.entity';
import { IMonitorRepository } from '../Imonitor.repository';
import { injectable } from 'inversify';

@injectable()
export default class MonitorRepository implements IMonitorRepository {
  private repository: MongoRepository<Monitor>;

  constructor() {
    this.repository = MongoDataSource.getMongoRepository(Monitor);
  }

  async saveOne(payload: Partial<Monitor>): Promise<Monitor> {
    const result = await this.repository.save(payload);

    return result;
  }

  async findOne(payload: Partial<Monitor>): Promise<Monitor | null> {
    const result = await this.repository.findOne({
      where: { ...payload },
    });

    return result;
  }

  async updateOne(params: {
    objectId: number;
    payload: Partial<Monitor>;
  }): Promise<boolean> {
    const { objectId, payload } = params;

    const result = await this.repository.update(objectId, payload);

    return !!result.affected;
  }

  async find(): Promise<Monitor[]> {
    const result = await this.repository.find();

    return result;
  }
}
