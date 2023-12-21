import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { mongoDBVariables } from '../../../config/variables.config';
import { AccountingMonitor } from './accounting-monitor/implementations/accounting-monitor.entity';
import { User } from './user/implementations/user.entity';
import { Monitor } from './monitor/implementations/monitor.entity';

const { connectionUri, database, queryPermissions } = mongoDBVariables;

export const MongoDataSource = new DataSource({
  type: 'mongodb',
  url: `${connectionUri}/${database}?${queryPermissions}`,
  authSource: 'admin',
  useNewUrlParser: true,
  synchronize: true,
  logging: true,
  entities: [AccountingMonitor, User, Monitor],
});
