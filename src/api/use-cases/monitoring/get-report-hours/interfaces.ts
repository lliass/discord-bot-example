import { IUseCase } from '../../../common/interfaces/use-case.interface';
import {
  GetReportHoursRequestDTO,
  IGetReportHoursResponseDTO,
} from './get-report-hours.dto';

interface IGetReportHoursUseCase extends IUseCase {
  execute(
    params: GetReportHoursRequestDTO,
  ): Promise<IGetReportHoursResponseDTO>;
}

const GET_REPORT_HOURS_USE_CASE_TYPE = Symbol.for('IGetReportHoursUseCase');

export { IGetReportHoursUseCase, GET_REPORT_HOURS_USE_CASE_TYPE };
