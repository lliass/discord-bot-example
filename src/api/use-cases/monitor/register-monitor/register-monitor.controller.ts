import { Request, Response } from 'express';
import { getStatusCode } from 'http-status-codes';
import {
  ControllerSpecifications,
  IController,
} from '../../../common/interfaces/controller.interface';
import { PostRegisterMonitorRequestDTO } from './register-monitor.dto';
import { inject, injectable } from 'inversify';
import HttpErrorInfra from '../../../infra/http-error/http.error.infra';
import controllersConfig from '../config/controllers.config';
import {
  REGISTER_MONITOR_USE_CASE_TYPE,
  IRegisterMonitorUseCase,
} from './interfaces';
import ValidatePipeInfra from '../../../infra/ validation-pipe/validate-pipe.infra';

@injectable()
export default class RegisterMonitorController implements IController {
  specifications: ControllerSpecifications = {
    method: 'POST',
    route: `/${controllersConfig.baseEndPoint}/register`,
    hasJwtAuth: true,
  };
  @inject(HttpErrorInfra) httpError: HttpErrorInfra;

  @inject(REGISTER_MONITOR_USE_CASE_TYPE)
  useCase: IRegisterMonitorUseCase;

  @inject(ValidatePipeInfra) validatePipe: ValidatePipeInfra;

  async handle(request: Request, response: Response): Promise<Response> {
    const { name, nickname, roles, contractDate } =
      request.body as unknown as PostRegisterMonitorRequestDTO;

    try {
      await this.validatePipe.validateBody({
        body: request.body,
        RequestDTO: PostRegisterMonitorRequestDTO,
      });

      await this.useCase.execute({ name, nickname, roles, contractDate });

      return response.status(getStatusCode('Created')).send();
    } catch (error) {
      return this.httpError.handler(response, error);
    }
  }
}
