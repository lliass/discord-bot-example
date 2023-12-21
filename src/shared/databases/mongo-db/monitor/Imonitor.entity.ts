export interface IMonitor {
  id: number;
  name: string;
  nickname: string;
  latestNicknames: string[];
  roles: string[];
  contractDate?: Date;
  active: boolean;
}
