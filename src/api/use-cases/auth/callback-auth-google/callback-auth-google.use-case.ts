import { ICallbackAuthGoogleUseCase } from './interfaces';
import { inject, injectable } from 'inversify';
import {
  CallbackAuthGoogleDTORequest,
  CallbackAuthGoogleDTOResponse,
} from './callback-auth-google.dto';
import { authVariables } from '../../../../config/variables.config';
import jwt from 'jsonwebtoken';
import {
  IMailProvider,
  MAIL_PROVIDER_TYPE,
} from '../../../providers/mail/Imail.provider';
import userPasswordAccessTemplate from '../../../common/assets/html-templates/user-password-access.template';
import {
  IUserRepository,
  USER_REPOSITORY_TYPE,
} from '../../../../shared/databases/mongo-db/user/Iuser.repository';
import {
  CRYPTO_INFRA_TYPE,
  ICryptoInfra,
} from '../../../infra/crypto/Icrypto.infra';
import DateHelper from '../../../../shared/helpers/date.helper';

@injectable()
export default class CallbackAuthGoogleUseUseCase
  implements ICallbackAuthGoogleUseCase
{
  @inject(MAIL_PROVIDER_TYPE)
  private mailProvider: IMailProvider;

  @inject(USER_REPOSITORY_TYPE)
  private userRepository: IUserRepository;

  @inject(CRYPTO_INFRA_TYPE)
  private cryptoInfra: ICryptoInfra;

  @inject(DateHelper)
  private dateHelper: DateHelper;

  async execute(
    params: CallbackAuthGoogleDTORequest,
  ): Promise<CallbackAuthGoogleDTOResponse> {
    const { email: emailFromGoogleAuth } = params;

    const userFounded = await this.userRepository.findOne({
      email: emailFromGoogleAuth,
    });

    let jwtPayload: Record<string, string>;

    if (!userFounded) {
      const newUserPassword = this.cryptoInfra.generatePassword();

      const newUserAccessKey = this.cryptoInfra.generateToken();

      const encryptedNewPassword = await this.cryptoInfra.encryptPassword({
        password: newUserPassword,
      });

      const newUserCreationDate =
        this.dateHelper.getFormattedDateFromAmericaSaoPaulo(new Date());

      const newUser = await this.userRepository.saveOne({
        email: emailFromGoogleAuth,
        password: encryptedNewPassword,
        creationDate: newUserCreationDate,
        blocked: false,
        accessKey: newUserAccessKey,
        attempts: 0,
      });

      await this.mailProvider.sendMail({
        to: emailFromGoogleAuth,
        subject: 'Moni-Thor Credentials',
        text: 'credentials',
        html: userPasswordAccessTemplate
          .replace('{{ACCESS_KEY}}', newUserAccessKey)
          .replace('{{PASSWORD}}', newUserPassword),
      });

      jwtPayload = { email: newUser.email, accessKey: newUser.accessKey };
    } else {
      jwtPayload = {
        email: userFounded.email,
        accessKey: userFounded.accessKey,
      };
    }

    const token = jwt.sign(jwtPayload, authVariables.jwtSecretKey, {
      expiresIn: '12h',
    });

    return { token };
  }
}
