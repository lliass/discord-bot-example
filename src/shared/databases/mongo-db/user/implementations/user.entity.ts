import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { IUser } from '../Iuser.entity';

@Entity({ name: 'user' })
export class User implements IUser {
  @ObjectIdColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  creationDate: Date;

  @Column()
  blocked: boolean;

  @Column({ unique: true })
  accessKey: string;

  @Column()
  attempts: number;
}
