import container from '../../../../config/inversify.config';
import RedirectAuthGoogleController from './redirect-auth-google.controller';

const redirectAuthGoogleController =
  container.get<RedirectAuthGoogleController>(RedirectAuthGoogleController);

export { redirectAuthGoogleController };
