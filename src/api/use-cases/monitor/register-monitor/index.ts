import container from '../../../../config/inversify.config';
import RegisterMonitorController from './register-monitor.controller';

const registerMonitorController = container.get<RegisterMonitorController>(
  RegisterMonitorController,
);

export { registerMonitorController };
