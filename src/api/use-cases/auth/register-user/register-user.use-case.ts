import { IRegisterUserUseCase } from './interfaces';
import { inject, injectable } from 'inversify';
import { PostRegisterUserRequestDTO } from './register-user.dto';
import { authVariables } from '../../../../config/variables.config';
import {
  IMailProvider,
  MAIL_PROVIDER_TYPE,
} from '../../../providers/mail/Imail.provider';
import userAccessKeyTemplate from '../../../common/assets/html-templates/access-key.template';
import {
  IUserRepository,
  USER_REPOSITORY_TYPE,
} from '../../../../shared/databases/mongo-db/user/Iuser.repository';
import {
  CRYPTO_INFRA_TYPE,
  ICryptoInfra,
} from '../../../infra/crypto/Icrypto.infra';
import DateHelper from '../../../../shared/helpers/date.helper';
import { BadRequest } from 'http-errors';

@injectable()
export default class RegisterUserUseCase implements IRegisterUserUseCase {
  specifications = {
    allowedEmailDomains: [...authVariables.allowedEmailDomains.split(',')],
  };

  @inject(MAIL_PROVIDER_TYPE)
  private mailProvider: IMailProvider;

  @inject(USER_REPOSITORY_TYPE)
  private userRepository: IUserRepository;

  @inject(CRYPTO_INFRA_TYPE)
  private cryptoInfra: ICryptoInfra;

  @inject(DateHelper)
  private dateHelper: DateHelper;

  async execute(params: PostRegisterUserRequestDTO): Promise<void> {
    const { email, password } = params;

    const { allowedEmailDomains } = this.specifications;

    const emailDomain = email.split('@')[1];

    const emailDomainIsNotAllowed = !allowedEmailDomains.includes(emailDomain);

    if (emailDomainIsNotAllowed)
      throw new BadRequest('Email domain is not allowed');

    const userFound = await this.userRepository.findOne({ email });

    if (!!userFound) throw new BadRequest('Email already registered');

    const newUserAccessKey = this.cryptoInfra.generateToken();

    const encryptedPassword = await this.cryptoInfra.encryptPassword({
      password,
    });

    const newUserCreationDate =
      this.dateHelper.getFormattedDateFromAmericaSaoPaulo(new Date());

    await this.userRepository.saveOne({
      email,
      password: encryptedPassword,
      creationDate: newUserCreationDate,
      blocked: false,
      accessKey: newUserAccessKey,
      attempts: 0,
    });

    await this.mailProvider.sendMail({
      to: email,
      subject: 'Moni-Thor Credentials',
      text: 'credentials',
      html: userAccessKeyTemplate.replace('{{ACCESS_KEY}}', newUserAccessKey),
    });
  }
}
