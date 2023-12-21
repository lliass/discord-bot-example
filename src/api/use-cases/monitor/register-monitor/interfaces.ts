import { IUseCase } from '../../../common/interfaces/use-case.interface';
import { PostRegisterMonitorRequestDTO } from './register-monitor.dto';

interface IRegisterMonitorUseCase extends IUseCase {
  execute(params: PostRegisterMonitorRequestDTO): Promise<void>;
}

const REGISTER_MONITOR_USE_CASE_TYPE = Symbol.for('IRegisterMonitorUseCase');

export { IRegisterMonitorUseCase, REGISTER_MONITOR_USE_CASE_TYPE };
