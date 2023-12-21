import { injectable } from 'inversify';
import {
  EncryptPasswordParameters,
  ICryptoInfra,
  ValidateEncryptedPasswordParameters,
} from '../Icrypto.infra';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

@injectable()
export default class CryptoInfra implements ICryptoInfra {
  private cryptoTool = crypto;
  private bcryptTool = bcrypt;

  generateToken(): string {
    const generatedToken = this.cryptoTool.randomBytes(20).toString('hex');

    return generatedToken;
  }

  generatePassword(): string {
    const generatedPassword = this.cryptoTool.randomBytes(10).toString('hex');

    return generatedPassword;
  }

  async encryptPassword(params: EncryptPasswordParameters): Promise<string> {
    const { password } = params;

    const salt = await this.bcryptTool.genSalt(10);

    const passwordEncrypted = await this.bcryptTool.hash(password, salt);

    return passwordEncrypted;
  }

  async validateEncryptedPassword(
    params: ValidateEncryptedPasswordParameters,
  ): Promise<boolean> {
    const { forwardedPassword, encryptedPassword } = params;

    const isMatch = await this.bcryptTool.compare(
      forwardedPassword,
      encryptedPassword,
    );

    return isMatch;
  }
}
