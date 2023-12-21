import { Request, Response } from 'express';
import { getStatusCode } from 'http-status-codes';
import { injectable, inject } from 'inversify';
import {
  GET_AVAILABLE_DATES_USE_CASE_TYPE,
  IGetAvailableDatesUseCase,
} from './interfaces';
import {
  ControllerSpecifications,
  IController,
} from '../../../common/interfaces/controller.interface';
import HttpErrorInfra from '../../../infra/http-error/http.error.infra';
import controllersConfig from '../config/controllers.config';

@injectable()
export default class GetAvailableDatesController implements IController {
  specifications: ControllerSpecifications = {
    method: 'GET',
    route: `/${controllersConfig.baseEndPoint}/availableDates`,
    hasJwtAuth: true,
  };
  @inject(HttpErrorInfra) httpError: HttpErrorInfra;
  @inject(GET_AVAILABLE_DATES_USE_CASE_TYPE)
  useCase: IGetAvailableDatesUseCase;

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const result = await this.useCase.execute();

      return response.status(getStatusCode('OK')).json(result);
    } catch (error) {
      return this.httpError.handler(response, error);
    }
  }
}
