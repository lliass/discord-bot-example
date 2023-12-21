import { IUseCase } from '../../../common/interfaces/use-case.interface';
import {
  GetValidateTokenRequestDTO,
  GetValidateTokenResponseDTO,
} from './validate.dto';

interface IValidateUseCase extends IUseCase {
  execute(
    params: GetValidateTokenRequestDTO,
  ): Promise<GetValidateTokenResponseDTO>;
}

const VALIDATE_USE_CASE_TYPE = Symbol.for('IValidateUseCase');

export { IValidateUseCase, VALIDATE_USE_CASE_TYPE };
