import { Request, Response } from 'express';
import { getStatusCode } from 'http-status-codes';
import {
  ControllerSpecifications,
  IController,
} from '../../common/interfaces/controller.interface';
import { inject, injectable } from 'inversify';
import HttpErrorInfra from '../../infra/http-error/http.error.infra';

@injectable()
export default class HealthCheckController implements IController {
  specifications: ControllerSpecifications = {
    method: 'GET',
    route: '/',
    hasJwtAuth: false,
  };
  @inject(HttpErrorInfra) httpError: HttpErrorInfra;
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      return response.status(getStatusCode('OK')).send('OK');
    } catch (error) {
      return this.httpError.handler(response, error);
    }
  }
}
