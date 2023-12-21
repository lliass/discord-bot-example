import { IValidateUseCase } from './interfaces';
import { injectable } from 'inversify';
import {
  GetValidateTokenRequestDTO,
  GetValidateTokenResponseDTO,
} from './validate.dto';
import { authVariables } from '../../../../config/variables.config';
import { BadRequest } from 'http-errors';
import jwt from 'jsonwebtoken';

@injectable()
export default class ValidateUseCase implements IValidateUseCase {
  async execute(
    params: GetValidateTokenRequestDTO,
  ): Promise<GetValidateTokenResponseDTO> {
    const { token } = params;

    jwt.verify(token, authVariables.jwtSecretKey, (error) => {
      if (error) throw new BadRequest('Invalid token!');
    });

    return { message: 'Token is valid!' };
  }
}
