import HealthCheckController from './health-check.controller';
import container from '../../../config/inversify.config';

const healthCheckController = container.get<HealthCheckController>(
  HealthCheckController,
);

export { healthCheckController };
