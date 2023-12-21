export interface IUser {
  id: number;
  email: string;
  password: string;
  creationDate: Date;
  blocked: boolean;
  accessKey: string;
  attempts: number;
}
