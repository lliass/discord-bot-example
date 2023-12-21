interface EncryptPasswordParameters {
  password: string;
}

interface ValidateEncryptedPasswordParameters {
  forwardedPassword: string;
  encryptedPassword: string;
}

interface ICryptoInfra {
  generatePassword(): string;
  encryptPassword(params: EncryptPasswordParameters): Promise<string>;
  generateToken(): string;
  validateEncryptedPassword(
    params: ValidateEncryptedPasswordParameters,
  ): Promise<boolean>;
}

const CRYPTO_INFRA_TYPE = Symbol.for('ICryptoInfra');

export {
  CRYPTO_INFRA_TYPE,
  ICryptoInfra,
  EncryptPasswordParameters,
  ValidateEncryptedPasswordParameters,
};
