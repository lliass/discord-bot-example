import { Request, Response } from 'express';
import { getStatusCode } from 'http-status-codes';
import {
  ControllerSpecifications,
  IController,
} from '../../../common/interfaces/controller.interface';
import { PostRegisterUserRequestDTO } from './register-user.dto';
import { inject, injectable } from 'inversify';
import HttpErrorInfra from '../../../infra/http-error/http.error.infra';
import controllersConfig from '../config/controllers.config';
import {
  REGISTER_USER_USE_CASE_TYPE,
  IRegisterUserUseCase,
} from './interfaces';
import ValidatePipeInfra from '../../../infra/ validation-pipe/validate-pipe.infra';

@injectable()
export default class RegisterUserController implements IController {
  specifications: ControllerSpecifications = {
    method: 'POST',
    route: `/${controllersConfig.baseEndPoint}/register`,
    hasJwtAuth: false,
  };
  @inject(HttpErrorInfra) httpError: HttpErrorInfra;

  @inject(REGISTER_USER_USE_CASE_TYPE)
  useCase: IRegisterUserUseCase;

  @inject(ValidatePipeInfra) validatePipe: ValidatePipeInfra;

  async handle(request: Request, response: Response): Promise<Response> {
    const { email, password } =
      request.body as unknown as PostRegisterUserRequestDTO;

    try {
      await this.validatePipe.validateBody({
        body: request.body,
        RequestDTO: PostRegisterUserRequestDTO,
      });

      await this.useCase.execute({ email, password });

      return response.status(getStatusCode('Created')).send();
    } catch (error) {
      return this.httpError.handler(response, error);
    }
  }
}
