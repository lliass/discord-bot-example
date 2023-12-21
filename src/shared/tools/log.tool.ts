import { createLogger, format, transports, Logger } from 'winston';
import moment from 'moment-timezone';
import { injectable } from 'inversify';
import { ILogger } from './interfaces';

const { combine, label, prettyPrint } = format;

const appendTimestamp = format((info, opts) => {
  if (opts.tz)
    info.timestamp = moment().tz(opts.tz).format('DD/MM/yyyy HH:mm:ss');
  return info;
});

@injectable()
export default class LogTool implements ILogger {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      format: combine(
        label({ label: 'Moni-Thor' }),
        appendTimestamp({ tz: 'America/Sao_Paulo' }),
        prettyPrint(),
      ),
      transports: [new transports.Console()],
    });
  }

  public currentDate(): void {
    this.logger.log({ level: 'info', message: 'What time is the testing at?' });
  }

  public error(params: { errorMessage: string; errorStack: any }): void {
    const { errorMessage, errorStack } = params;

    this.logger.log({
      level: 'error',
      message: `${errorMessage}: \n ${JSON.stringify(errorStack)}`,
    });
  }

  public dynamicMessage(params: { message: string }): void {
    const { message } = params;

    this.logger.log({
      level: 'info',
      message,
    });
  }
}
