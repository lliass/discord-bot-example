import { Request, Response } from 'express';
import { getStatusCode } from 'http-status-codes';
import { injectable, inject } from 'inversify';
import {
  GET_REPORT_HOURS_USE_CASE_TYPE,
  IGetReportHoursUseCase,
} from './interfaces';
import {
  ControllerSpecifications,
  IController,
} from '../../../common/interfaces/controller.interface';
import HttpErrorInfra from '../../../infra/http-error/http.error.infra';
import { GetReportHoursRequestDTO } from './get-report-hours.dto';
import ValidatePipeInfra from '../../../infra/ validation-pipe/validate-pipe.infra';
import controllersConfig from '../config/controllers.config';

@injectable()
export default class GetReportHoursController implements IController {
  specifications: ControllerSpecifications = {
    method: 'GET',
    route: `/${controllersConfig.baseEndPoint}/reportHours`,
    hasJwtAuth: true,
  };
  @inject(HttpErrorInfra) httpError: HttpErrorInfra;
  @inject(ValidatePipeInfra) validatePipe: ValidatePipeInfra;
  @inject(GET_REPORT_HOURS_USE_CASE_TYPE)
  useCase: IGetReportHoursUseCase;

  async handle(request: Request, response: Response): Promise<Response> {
    const { startDate, endDate } =
      request.query as unknown as GetReportHoursRequestDTO;

    try {
      await this.validatePipe.validateQueryParams({
        queryParams: request.query,
        RequestDTO: GetReportHoursRequestDTO,
      });

      const result = await this.useCase.execute({ startDate, endDate });

      return response.status(getStatusCode('OK')).json(result);
    } catch (error) {
      return this.httpError.handler(response, error);
    }
  }
}
