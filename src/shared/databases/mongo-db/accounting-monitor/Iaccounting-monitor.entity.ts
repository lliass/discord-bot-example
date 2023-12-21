export interface IMonitorOptions {
  firstEntry?: string;
  lastExit?: string;
}

export type MonitorsType = Record<string, IMonitorOptions>;

export interface IAccountingMonitor {
  id: number;
  creationDate: Date;
  monitors: MonitorsType;
}
