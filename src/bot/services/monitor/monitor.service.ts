import {
  ACCOUNTING_MONITOR_REPOSITORY_TYPE,
  IAccountingMonitorRepository,
} from '../../../shared/databases/mongo-db/accounting-monitor/Iaccounting-monitor.repository';
import { MonitorsType } from '../../../shared/databases/mongo-db/accounting-monitor/Iaccounting-monitor.entity';
import { cloneDeep, omit } from 'lodash';
import { format } from 'date-fns';
import MonitorHelperService from './monitor-helper.service';
import { inject, injectable } from 'inversify';
import { logTool } from '../../../shared/tools/index';

interface IMonitorOptionsInteractions {
  creationDocumentDate: Date;
  monitorUserName: string;
  accessOutOfTime?: boolean;
}

@injectable()
export default class MonitorService {
  private _rolesNames = ['Monitoria', 'Monitor', 'Monitora'];
  private _monitoringChannels = [
    'MONITORIA - PROGRAMAÇÃO',
    'MONITORIA - ESTUDANTES ANEE',
    'MONITORIA - CODE REVIEW',
  ];
  private _monitoringTime: Record<'monitoringStart' | 'monitoringEnd', string> =
    {
      monitoringStart: '18:00',
      monitoringEnd: '21:30',
    };

  constructor(
    @inject(ACCOUNTING_MONITOR_REPOSITORY_TYPE)
    private accountingMonitorRepository: IAccountingMonitorRepository,
    @inject(MonitorHelperService)
    private monitorHelperService: MonitorHelperService,
  ) {}

  public getMonitorRolesNames(): string[] {
    return this._rolesNames;
  }

  public checkIfTheRoleBelongToTheRoleOfMonitor(role: string): boolean {
    const rolesNames = this._rolesNames;

    const roleExistInMonitorRoles = rolesNames.some((roleName) =>
      role.toUpperCase().includes(roleName.toUpperCase()),
    );

    if (roleExistInMonitorRoles) {
      return true;
    }

    return false;
  }

  public checkIfTheMonitorCanWorkOnTheCurrentDay(currentDate: Date): boolean {
    const formattedDate = currentDate.toString();

    const formattedDay = formattedDate.substring(0, 3);

    const actualDayIsOnTheWeekend =
      formattedDay === 'Sat' || formattedDay === 'Sun';

    if (actualDayIsOnTheWeekend) {
      return false;
    }

    return true;
  }

  public checkIfTheMonitorsEntryIsWithinMonitoringTime(
    currentDate: Date,
  ): boolean {
    const { currentHours, currentMinutes } =
      this.monitorHelperService.getCurrentHoursAndMinutes(currentDate);

    const [monitoringStartHour, monitoringStartMinute] =
      this._monitoringTime.monitoringStart.split(':');

    const currentHoursInMinutes =
      this.monitorHelperService.calculateHoursAndMinuteInTotal({
        hours: currentHours,
        minutes: currentMinutes,
      });

    const monitoringStartTimeInMinutes =
      this.monitorHelperService.calculateHoursAndMinuteInTotal({
        hours: +monitoringStartHour,
        minutes: +monitoringStartMinute,
      });

    return currentHoursInMinutes >= monitoringStartTimeInMinutes;
  }

  public checkIfTheMonitorsExitIsWithinMonitoringTime(
    currentDate: Date,
  ): boolean {
    const { currentHours, currentMinutes } =
      this.monitorHelperService.getCurrentHoursAndMinutes(currentDate);

    const [monitoringEndHour, monitoringEndMinute] =
      this._monitoringTime.monitoringEnd.split(':');

    const currentHoursInMinutes =
      this.monitorHelperService.calculateHoursAndMinuteInTotal({
        hours: currentHours,
        minutes: currentMinutes,
      });

    const monitoringEndTimeInMinutes =
      this.monitorHelperService.calculateHoursAndMinuteInTotal({
        hours: +monitoringEndHour,
        minutes: +monitoringEndMinute,
      });

    return currentHoursInMinutes <= monitoringEndTimeInMinutes;
  }

  public checkIfTheMonitorCanWorkOnTheCurrentTime(currentDate: Date): boolean {
    const monitorsEntryIsWithinTheMonitoringTime =
      this.checkIfTheMonitorsEntryIsWithinMonitoringTime(currentDate);

    const monitorsExitIsWithinTheMonitoringTime =
      this.checkIfTheMonitorsExitIsWithinMonitoringTime(currentDate);

    return (
      monitorsEntryIsWithinTheMonitoringTime &&
      monitorsExitIsWithinTheMonitoringTime
    );
  }

  public checkIfTheChannelIsPartOfTheMonitoringChannels(
    channelName: string,
  ): boolean {
    const monitoringChannels = this._monitoringChannels;

    const channelExistInMonitoringChannelList = monitoringChannels.some(
      (monitoringChannel) =>
        monitoringChannel.toUpperCase() === channelName.toUpperCase(),
    );

    return channelExistInMonitoringChannelList;
  }

  async verifyIfTheMonitoringDayExist(
    creationDocumentDate: Date,
  ): Promise<boolean> {
    const result = await this.accountingMonitorRepository.findOne({
      creationDate: creationDocumentDate,
    });

    return !!result;
  }

  getMonitoringDocumentDate(): string {
    const documentMonitoringDate = format(new Date(), 'yyyy-MM-dd');

    const defaultDocumentMonitoringHour = '00:00:00';

    return `${documentMonitoringDate} ${defaultDocumentMonitoringHour}`;
  }

  async insertMonitorInMonitoringTrackingIfTheyDoNotExist(
    params: IMonitorOptionsInteractions,
  ): Promise<void> {
    const { creationDocumentDate, monitorUserName, accessOutOfTime } = params;

    const monitoringTrackingFound =
      await this.accountingMonitorRepository.findOne({
        creationDate: creationDocumentDate,
      });

    const monitoringTrackingClone = cloneDeep(monitoringTrackingFound);

    const monitorDoesNotExistInTrackingMonitoring = !(
      monitoringTrackingClone &&
      monitorUserName in monitoringTrackingClone.monitors
    );

    if (monitorDoesNotExistInTrackingMonitoring) {
      const entryDateToBeInsert =
        this.monitorHelperService.getTheEntryOrExitDateAccordingToTheTypeOfMonitorAccess(
          {
            accessOutOfTime: !!accessOutOfTime,
            accessType: 'entry',
          },
        );

      if (monitoringTrackingClone)
        monitoringTrackingClone.monitors[monitorUserName] = {
          firstEntry: entryDateToBeInsert,
        };

      await this.accountingMonitorRepository.updateOne({
        objectId: monitoringTrackingClone?.id as number,
        payload: omit(monitoringTrackingClone, ['id']),
      });
    }
  }

  async createMonitoringTrackingAndTheFirstMonitor(
    params: IMonitorOptionsInteractions,
  ): Promise<void> {
    const { creationDocumentDate, monitorUserName, accessOutOfTime } = params;

    const entryDateToBeInsert =
      this.monitorHelperService.getTheEntryOrExitDateAccordingToTheTypeOfMonitorAccess(
        {
          accessOutOfTime: !!accessOutOfTime,
          accessType: 'entry',
        },
      );

    const firstMonitorToBeInsert: MonitorsType = {
      [monitorUserName]: { firstEntry: entryDateToBeInsert },
    };

    await this.accountingMonitorRepository.saveOne({
      creationDate: creationDocumentDate,
      monitors: firstMonitorToBeInsert,
    });
  }

  async updateMonitorsLastExitInMonitoringTracking(
    params: IMonitorOptionsInteractions,
  ): Promise<void> {
    const { creationDocumentDate, monitorUserName, accessOutOfTime } = params;

    const monitoringTrackingFound =
      await this.accountingMonitorRepository.findOne({
        creationDate: creationDocumentDate,
      });

    const monitoringTrackingClone = cloneDeep(monitoringTrackingFound);

    const monitorExistInTrackingMonitoring =
      monitoringTrackingClone &&
      monitorUserName in monitoringTrackingClone.monitors;

    if (monitorExistInTrackingMonitoring) {
      const exitDateToBeInsert =
        this.monitorHelperService.getTheEntryOrExitDateAccordingToTheTypeOfMonitorAccess(
          {
            accessOutOfTime: !!accessOutOfTime,
            accessType: 'exit',
          },
        );

      if (monitoringTrackingClone)
        monitoringTrackingClone.monitors[monitorUserName] = {
          ...monitoringTrackingClone.monitors[monitorUserName],
          lastExit: exitDateToBeInsert,
        };

      await this.accountingMonitorRepository.updateOne({
        objectId: monitoringTrackingClone?.id as number,
        payload: omit(monitoringTrackingClone, ['id']),
      });
    }
  }

  public monitorActionsOnMonitoringChannels(params: {
    action: 'entered' | 'left';
    monitorName: string;
  }): void {
    const { action, monitorName } = params;

    const formattedMessage = `Monitor ${monitorName} ${action} monitoring!`;

    logTool.dynamicMessage({ message: formattedMessage });
  }
}
