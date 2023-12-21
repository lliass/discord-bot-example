import { MongoRepository } from 'typeorm';
import { MongoDataSource } from '../../data-source';
import { User } from './user.entity';
import { IUserRepository } from '../Iuser.repository';
import { injectable } from 'inversify';

@injectable()
export default class UserRepository implements IUserRepository {
  private repository: MongoRepository<User>;

  constructor() {
    this.repository = MongoDataSource.getMongoRepository(User);
  }

  async saveOne(payload: Partial<User>): Promise<User> {
    const result = await this.repository.save(payload);

    return result;
  }

  async findOne(payload: Partial<User>): Promise<User | null> {
    const result = await this.repository.findOne({
      where: { ...payload },
    });

    return result;
  }

  async updateOne(params: {
    objectId: number;
    payload: Partial<User>;
  }): Promise<boolean> {
    const { objectId, payload } = params;

    const result = await this.repository.update(objectId, payload);

    return !!result.affected;
  }
}
