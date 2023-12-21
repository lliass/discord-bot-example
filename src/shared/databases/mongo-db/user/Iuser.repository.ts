import { IUser } from './Iuser.entity';

interface IUserRepository {
  saveOne(payload: Partial<IUser>): Promise<IUser>;
  findOne(payload: Partial<IUser>): Promise<IUser | null>;
  updateOne(params: {
    objectId: number;
    payload: Partial<IUser>;
  }): Promise<boolean>;
}

const USER_REPOSITORY_TYPE = Symbol.for('IUserRepository');

export { USER_REPOSITORY_TYPE, IUserRepository };
