import { Request, Response } from 'express';
import {
  ControllerSpecifications,
  IController,
} from '../../../common/interfaces/controller.interface';
import { inject, injectable } from 'inversify';
import HttpErrorInfra from '../../../infra/http-error/http.error.infra';
import controllersConfig from '../config/controllers.config';
import {
  CALLBACK_AUTH_GOOGLE_USE_CASE_TYPE,
  ICallbackAuthGoogleUseCase,
} from './interfaces';
import { Profile } from 'passport-google-oauth20';
import { apiVariables } from '../../../../config/variables.config';

@injectable()
export default class CallbackAuthGoogleController implements IController {
  specifications: ControllerSpecifications = {
    method: 'GET',
    route: `/${controllersConfig.baseEndPoint}/google/callback`,
    googleAuthConfig: 'callback',
    hasJwtAuth: false,
  };
  @inject(HttpErrorInfra) httpError: HttpErrorInfra;

  @inject(CALLBACK_AUTH_GOOGLE_USE_CASE_TYPE)
  useCase: ICallbackAuthGoogleUseCase;
  async handle(request: Request, response: Response): Promise<Response | void> {
    const { _json: profileComplements } = request.user as Profile;

    const emailToCreateToken = `${profileComplements.email}`;

    try {
      const result = await this.useCase.execute({ email: emailToCreateToken });

      return response.redirect(
        `${apiVariables.frontEndHost}/?token=${result.token}`,
      );
    } catch (error) {
      return this.httpError.handler(response, error);
    }
  }
}
