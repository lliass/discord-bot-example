import { injectable } from 'inversify';
import { IMailProvider, SendMailParams } from '../Imail.provider';
import sendGridMail from '@sendgrid/mail';
import { mailProviderVariables } from '../../../../config/variables.config';

@injectable()
export default class MailProvider implements IMailProvider {
  private specifications = {
    defaultEmail: mailProviderVariables.defaultCommunicationMail,
  };

  constructor() {
    sendGridMail.setApiKey(mailProviderVariables.sendGridApiKey);
  }

  async sendMail(parameters: SendMailParams): Promise<void> {
    const { to, subject, text, html } = parameters;

    const { defaultEmail } = this.specifications;

    await sendGridMail.send({ to, from: defaultEmail, subject, text, html });
  }
}
