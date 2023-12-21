interface SendMailParams {
  to: string;
  subject: string;
  text: string;
  html: string;
}

interface IMailProvider {
  sendMail(parameters: SendMailParams): Promise<void>;
}

const MAIL_PROVIDER_TYPE = Symbol.for('IMailProvider');

export { MAIL_PROVIDER_TYPE, IMailProvider, SendMailParams };
