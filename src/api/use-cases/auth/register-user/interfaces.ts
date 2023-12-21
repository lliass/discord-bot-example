import { IUseCase } from '../../../common/interfaces/use-case.interface';
import { PostRegisterUserRequestDTO } from './register-user.dto';

interface IRegisterUserUseCase extends IUseCase {
  execute(params: PostRegisterUserRequestDTO): Promise<void>;
}

const REGISTER_USER_USE_CASE_TYPE = Symbol.for('IRegisterUserUseCase');

export { IRegisterUserUseCase, REGISTER_USER_USE_CASE_TYPE };
