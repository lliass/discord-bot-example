import container from '../../../../../config/inversify.config';
import {
  IMonitorRepository,
  MONITOR_REPOSITORY_TYPE,
} from '../Imonitor.repository';

const monitorRepository = container.get<IMonitorRepository>(
  MONITOR_REPOSITORY_TYPE,
);

export { monitorRepository };
