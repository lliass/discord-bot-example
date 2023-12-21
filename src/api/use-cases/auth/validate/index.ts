import container from '../../../../config/inversify.config';
import ValidateController from './validate.controller';

const validateController =
  container.get<ValidateController>(ValidateController);

export { validateController };
