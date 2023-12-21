import container from '../../config/inversify.config';
import { ILogger, LOGGER_TYPE } from './interfaces';

const logTool = container.get<ILogger>(LOGGER_TYPE);

export { logTool };
