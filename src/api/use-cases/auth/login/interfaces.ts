import { IUseCase } from '../../../common/interfaces/use-case.interface';
import { LoginRequestDTO, LoginResponseDTO } from './login.dto';

interface ILoginUseCase extends IUseCase {
  execute(params: LoginRequestDTO): Promise<LoginResponseDTO>;
}

const LOGIN_USE_CASE_TYPE = Symbol.for('ILoginUseCase');

export { ILoginUseCase, LOGIN_USE_CASE_TYPE };
