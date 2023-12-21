import { ILoginUseCase } from './interfaces';
import { inject, injectable } from 'inversify';
import { authVariables } from '../../../../config/variables.config';
import {
  IUserRepository,
  USER_REPOSITORY_TYPE,
} from '../../../../shared/databases/mongo-db/user/Iuser.repository';
import {
  CRYPTO_INFRA_TYPE,
  ICryptoInfra,
} from '../../../infra/crypto/Icrypto.infra';
import { BadRequest } from 'http-errors';
import { LoginRequestDTO, LoginResponseDTO } from './login.dto';
import { cloneDeep, omit } from 'lodash';
import jwt from 'jsonwebtoken';

@injectable()
export default class LoginUseCase implements ILoginUseCase {
  specifications = {
    limitOfAttempts: 5,
  };

  @inject(USER_REPOSITORY_TYPE)
  private userRepository: IUserRepository;

  @inject(CRYPTO_INFRA_TYPE)
  private cryptoInfra: ICryptoInfra;

  async execute(params: LoginRequestDTO): Promise<LoginResponseDTO> {
    const { email, password, accessKey } = params;

    const userFound = await this.userRepository.findOne({ email });

    if (!userFound) throw new BadRequest('User not found');

    const userIsBlocked = userFound.blocked;

    if (userIsBlocked) throw new BadRequest('User is blocked');

    const accessKeyIsNotCorrect = accessKey !== userFound.accessKey;

    const passwordIsNotCorrect =
      !(await this.cryptoInfra.validateEncryptedPassword({
        forwardedPassword: password,
        encryptedPassword: userFound.password,
      }));

    if (accessKeyIsNotCorrect || passwordIsNotCorrect) {
      const userClone = cloneDeep(userFound);

      userClone.attempts < this.specifications.limitOfAttempts
        ? userClone.attempts++
        : (userClone.blocked = true);

      await this.userRepository.updateOne({
        objectId: userFound.id,
        payload: omit(userClone, ['id']),
      });

      throw new BadRequest('Credentials are incorrect');
    }

    const jwtPayload: Record<string, string> = {
      email: userFound.email,
      accessKey: userFound.accessKey,
    };

    const token = jwt.sign(jwtPayload, authVariables.jwtSecretKey, {
      expiresIn: '12h',
    });

    return { token };
  }
}
