import container from '../../../../config/inversify.config';
import LoginController from './login.controller';

const loginController = container.get<LoginController>(LoginController);

export { loginController };
