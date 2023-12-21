import MonitorService from './monitor.service';
import container from '../../../config/inversify.config';

const monitorService = container.get<MonitorService>(MonitorService);

export { monitorService };
