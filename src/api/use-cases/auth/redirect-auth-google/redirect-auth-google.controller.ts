import { Request, Response } from 'express';
import { getStatusCode } from 'http-status-codes';
import {
  ControllerSpecifications,
  IController,
} from '../../../common/interfaces/controller.interface';
import { inject, injectable } from 'inversify';
import HttpErrorInfra from '../../../infra/http-error/http.error.infra';
import controllersConfig from '../config/controllers.config';

@injectable()
export default class RedirectAuthGoogleController implements IController {
  specifications: ControllerSpecifications = {
    method: 'GET',
    route: `/${controllersConfig.baseEndPoint}/google`,
    googleAuthConfig: 'redirect',
    hasJwtAuth: false,
  };
  @inject(HttpErrorInfra) httpError: HttpErrorInfra;
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      return response.status(getStatusCode('OK')).send('Already Redirected!');
    } catch (error) {
      return this.httpError.handler(response, error);
    }
  }
}
