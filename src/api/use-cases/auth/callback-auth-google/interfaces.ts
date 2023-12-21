import { IUseCase } from '../../../common/interfaces/use-case.interface';
import {
  CallbackAuthGoogleDTORequest,
  CallbackAuthGoogleDTOResponse,
} from './callback-auth-google.dto';

interface ICallbackAuthGoogleUseCase extends IUseCase {
  execute(
    params: CallbackAuthGoogleDTORequest,
  ): Promise<CallbackAuthGoogleDTOResponse>;
}

const CALLBACK_AUTH_GOOGLE_USE_CASE_TYPE = Symbol.for(
  'ICallbackAuthGoogleUseCase',
);

export { ICallbackAuthGoogleUseCase, CALLBACK_AUTH_GOOGLE_USE_CASE_TYPE };
