import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { IMonitor } from '../Imonitor.entity';

@Entity({ name: 'monitor' })
export class Monitor implements IMonitor {
  @ObjectIdColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  nickname: string;

  @Column()
  latestNicknames: string[];

  @Column()
  roles: string[];

  @Column()
  contractDate?: Date;

  @Column()
  active: boolean;
}
