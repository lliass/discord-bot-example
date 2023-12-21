import { Column, Entity, ObjectIdColumn } from 'typeorm';
import {
  IAccountingMonitor,
  MonitorsType,
} from '../Iaccounting-monitor.entity';

@Entity({ name: 'accounting-monitor' })
export class AccountingMonitor implements IAccountingMonitor {
  @ObjectIdColumn()
  id: number;

  @Column({ unique: true })
  creationDate: Date;

  @Column()
  monitors: MonitorsType;
}
