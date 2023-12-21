import { Request, Response } from 'express';
import { getStatusCode } from 'http-status-codes';
import {
  ControllerSpecifications,
  IController,
} from '../../../common/interfaces/controller.interface';
import { GetValidateTokenRequestDTO } from './validate.dto';
import { inject, injectable } from 'inversify';
import HttpErrorInfra from '../../../infra/http-error/http.error.infra';
import controllersConfig from '../config/controllers.config';
import { VALIDATE_USE_CASE_TYPE, IValidateUseCase } from './interfaces';
import ValidatePipeInfra from '../../../infra/ validation-pipe/validate-pipe.infra';

@injectable()
export default class ValidateController implements IController {
  specifications: ControllerSpecifications = {
    method: 'GET',
    route: `/${controllersConfig.baseEndPoint}/validate`,
    hasJwtAuth: false,
  };
  @inject(HttpErrorInfra) httpError: HttpErrorInfra;

  @inject(VALIDATE_USE_CASE_TYPE)
  useCase: IValidateUseCase;

  @inject(ValidatePipeInfra) validatePipe: ValidatePipeInfra;

  async handle(request: Request, response: Response): Promise<Response> {
    const { token } = request.query as unknown as GetValidateTokenRequestDTO;

    try {
      await this.validatePipe.validateQueryParams({
        queryParams: request.query,
        RequestDTO: GetValidateTokenRequestDTO,
      });

      const result = await this.useCase.execute({ token });

      return response.status(getStatusCode('OK')).json(result);
    } catch (error) {
      return this.httpError.handler(response, error);
    }
  }
}
