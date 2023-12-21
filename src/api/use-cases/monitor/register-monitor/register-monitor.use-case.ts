import { IRegisterMonitorUseCase } from './interfaces';
import { inject, injectable } from 'inversify';
import { PostRegisterMonitorRequestDTO } from './register-monitor.dto';
import {
  IMonitorRepository,
  MONITOR_REPOSITORY_TYPE,
} from '../../../../shared/databases/mongo-db/monitor/Imonitor.repository';
import { BadRequest } from 'http-errors';

@injectable()
export default class RegisterMonitorUseCase implements IRegisterMonitorUseCase {
  specifications = {
    defaultStatus: true,
  };

  @inject(MONITOR_REPOSITORY_TYPE)
  private monitorRepository: IMonitorRepository;

  async execute(params: PostRegisterMonitorRequestDTO): Promise<void> {
    const { name, nickname, roles, contractDate } = params;

    const monitor = await this.monitorRepository.findOne({ name });

    if (!!monitor) {
      throw new BadRequest('Monitor already exist');
    }

    const { defaultStatus } = this.specifications;

    await this.monitorRepository.saveOne({
      name,
      nickname,
      latestNicknames: [],
      roles,
      contractDate: new Date(`${contractDate}`),
      active: defaultStatus,
    });
  }
}
