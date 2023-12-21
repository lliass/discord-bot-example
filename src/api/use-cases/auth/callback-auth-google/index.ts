import container from '../../../../config/inversify.config';
import CallbackAuthGoogleController from './callback-auth-google.controller';

const callbackAuthGoogleController =
  container.get<CallbackAuthGoogleController>(CallbackAuthGoogleController);

export { callbackAuthGoogleController };
