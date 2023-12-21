import { injectable } from 'inversify';
import { request } from 'express';
import { validate } from 'class-validator';
import { BadRequest } from 'http-errors';

@injectable()
export default class ValidatePipeInfra {
  async validateQueryParams(params: {
    queryParams: typeof request.query;
    RequestDTO: new () => any;
  }): Promise<void> {
    const { queryParams, RequestDTO } = params;

    const requestDTO = new RequestDTO();

    Object.assign(requestDTO, queryParams);

    const errors = await validate(requestDTO);

    if (errors.length > 0)
      throw new BadRequest(
        'Query Params must be sent or are out of required formatting',
      );
  }

  async validateBody(params: {
    body: typeof request.body;
    RequestDTO: new () => any;
  }): Promise<void> {
    const { body, RequestDTO } = params;

    const requestDTO = new RequestDTO();

    Object.assign(requestDTO, body);

    const errors = await validate(requestDTO);

    if (errors.length > 0) {
      const [error] = errors;

      const [errorMessage] = Object.values({ ...error.constraints });

      throw new BadRequest(errorMessage);
    }
  }
}
