import { Request, Response } from 'express';
import { getStatusCode } from 'http-status-codes';
import {
  ControllerSpecifications,
  IController,
} from '../../../common/interfaces/controller.interface';
import { LoginRequestDTO } from './login.dto';
import { inject, injectable } from 'inversify';
import HttpErrorInfra from '../../../infra/http-error/http.error.infra';
import controllersConfig from '../config/controllers.config';
import { LOGIN_USE_CASE_TYPE, ILoginUseCase } from './interfaces';
import ValidatePipeInfra from '../../../infra/ validation-pipe/validate-pipe.infra';

@injectable()
export default class LoginController implements IController {
  specifications: ControllerSpecifications = {
    method: 'POST',
    route: `/${controllersConfig.baseEndPoint}/login`,
    hasJwtAuth: false,
  };

  @inject(HttpErrorInfra) httpError: HttpErrorInfra;

  @inject(LOGIN_USE_CASE_TYPE)
  useCase: ILoginUseCase;

  @inject(ValidatePipeInfra) validatePipe: ValidatePipeInfra;

  async handle(request: Request, response: Response): Promise<Response> {
    const { email, password, accessKey } =
      request.body as unknown as LoginRequestDTO;

    try {
      await this.validatePipe.validateBody({
        body: request.body,
        RequestDTO: LoginRequestDTO,
      });

      const { token } = await this.useCase.execute({
        email,
        password,
        accessKey,
      });

      return response.status(getStatusCode('Created')).json({ token });
    } catch (error) {
      return this.httpError.handler(response, error);
    }
  }
}
