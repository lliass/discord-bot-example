import container from '../../../../config/inversify.config';
import RegisterUserController from './register-user.controller';

const registerUserController = container.get<RegisterUserController>(
  RegisterUserController,
);

export { registerUserController };
