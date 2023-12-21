import { Container } from 'inversify';
//Imports for API
import HttpErrorInfra from '../api/infra/http-error/http.error.infra';
import ValidatePipeInfra from '../api/infra/ validation-pipe/validate-pipe.infra';
import GetAvailableDatesUseCase from '../api/use-cases/monitoring/get-available-dates/get-available-dates.use-case';
import GetAvailableDatesController from '../api/use-cases/monitoring/get-available-dates/get-available-dates.controller';
import {
  IGetAvailableDatesUseCase,
  GET_AVAILABLE_DATES_USE_CASE_TYPE,
} from '../api/use-cases/monitoring/get-available-dates/interfaces';
import HealthCheckController from '../api/use-cases/health-check/health-check.controller';
import GetReportHoursController from '../api/use-cases/monitoring/get-report-hours/get-report-hours.controller';
import GetReportHoursUseCase from '../api/use-cases/monitoring/get-report-hours/get-report-hours.use-case';
import {
  IGetReportHoursUseCase,
  GET_REPORT_HOURS_USE_CASE_TYPE,
} from '../api/use-cases/monitoring/get-report-hours/interfaces';
import RedirectAuthGoogleController from '../api/use-cases/auth/redirect-auth-google/redirect-auth-google.controller';
import CallbackAuthGoogleUseUseCase from '../api/use-cases/auth/callback-auth-google/callback-auth-google.use-case';
import CallbackAuthGoogleController from '../api/use-cases/auth/callback-auth-google/callback-auth-google.controller';
import {
  ICallbackAuthGoogleUseCase,
  CALLBACK_AUTH_GOOGLE_USE_CASE_TYPE,
} from '../api/use-cases/auth/callback-auth-google/interfaces';
import {
  IMailProvider,
  MAIL_PROVIDER_TYPE,
} from '../api/providers/mail/Imail.provider';
import MailProvider from '../api/providers/mail/implementation/mail.provider';
import {
  CRYPTO_INFRA_TYPE,
  ICryptoInfra,
} from '../api/infra/crypto/Icrypto.infra';
import CryptoInfra from '../api/infra/crypto/implementation/crypto.infra';
import JwtAuthMiddleware from '../api/middlewares/jwt-auth/jwt-auth.middleware';
import {
  IRegisterUserUseCase,
  REGISTER_USER_USE_CASE_TYPE,
} from '../api/use-cases/auth/register-user/interfaces';
import RegisterUserUseCase from '../api/use-cases/auth/register-user/register-user.use-case';
import RegisterUserController from '../api/use-cases/auth/register-user/register-user.controller';
//Imports for BOT
import MonitorHelperService from '../bot/services/monitor/monitor-helper.service';
import MonitorService from '../bot/services/monitor/monitor.service';
//import for Shared
import {
  ACCOUNTING_MONITOR_REPOSITORY_TYPE,
  IAccountingMonitorRepository,
} from '../shared/databases/mongo-db/accounting-monitor/Iaccounting-monitor.repository';
import AccountingMonitorRepository from '../shared/databases/mongo-db/accounting-monitor/implementations/accounting-monitor.repository';
import DateHelper from '../shared/helpers/date.helper';
import { ILogger, LOGGER_TYPE } from '../shared/tools/interfaces';
import LogTool from '../shared/tools/log.tool';
import {
  IUserRepository,
  USER_REPOSITORY_TYPE,
} from '../shared/databases/mongo-db/user/Iuser.repository';
import UserRepository from '../shared/databases/mongo-db/user/implementations/user.repository';
import {
  IMonitorRepository,
  MONITOR_REPOSITORY_TYPE,
} from '../shared/databases/mongo-db/monitor/Imonitor.repository';
import MonitorRepository from '../shared/databases/mongo-db/monitor/implementations/monitor.repository';
import {
  ILoginUseCase,
  LOGIN_USE_CASE_TYPE,
} from '../api/use-cases/auth/login/interfaces';
import LoginUseCase from '../api/use-cases/auth/login/login.use-case';
import LoginController from '../api/use-cases/auth/login/login.controller';
import {
  IValidateUseCase,
  VALIDATE_USE_CASE_TYPE,
} from '../api/use-cases/auth/validate/interfaces';
import ValidateUseCase from '../api/use-cases/auth/validate/validate.use-case';
import ValidateController from '../api/use-cases/auth/validate/validate.controller';

import {
  IRegisterMonitorUseCase,
  REGISTER_MONITOR_USE_CASE_TYPE,
} from '../api/use-cases/monitor/register-monitor/interfaces';
import RegisterMonitorUseCase from '../api/use-cases/monitor/register-monitor/register-monitor.use-case';
import RegisterMonitorController from '../api/use-cases/monitor/register-monitor/register-monitor.controller';

const container = new Container();

// Inversions for BOT
container.bind<MonitorHelperService>(MonitorHelperService).toSelf();
container.bind<MonitorService>(MonitorService).toSelf();

// Inversions for Shared
container
  .bind<IAccountingMonitorRepository>(ACCOUNTING_MONITOR_REPOSITORY_TYPE)
  .to(AccountingMonitorRepository);
container.bind<IUserRepository>(USER_REPOSITORY_TYPE).to(UserRepository);
container.bind<DateHelper>(DateHelper).toSelf();
container.bind<ILogger>(LOGGER_TYPE).to(LogTool);
container
  .bind<IMonitorRepository>(MONITOR_REPOSITORY_TYPE)
  .to(MonitorRepository);

// Inversions for API
container
  .bind<IGetAvailableDatesUseCase>(GET_AVAILABLE_DATES_USE_CASE_TYPE)
  .to(GetAvailableDatesUseCase);
container
  .bind<GetAvailableDatesController>(GetAvailableDatesController)
  .toSelf();
container
  .bind<IGetReportHoursUseCase>(GET_REPORT_HOURS_USE_CASE_TYPE)
  .to(GetReportHoursUseCase);
container.bind<GetReportHoursController>(GetReportHoursController).toSelf();
container.bind<HealthCheckController>(HealthCheckController).toSelf();
container.bind<HttpErrorInfra>(HttpErrorInfra).toSelf();
container.bind<ValidatePipeInfra>(ValidatePipeInfra).toSelf();
container
  .bind<RedirectAuthGoogleController>(RedirectAuthGoogleController)
  .toSelf();
container
  .bind<ICallbackAuthGoogleUseCase>(CALLBACK_AUTH_GOOGLE_USE_CASE_TYPE)
  .to(CallbackAuthGoogleUseUseCase);
container
  .bind<CallbackAuthGoogleController>(CallbackAuthGoogleController)
  .toSelf();
container.bind<IMailProvider>(MAIL_PROVIDER_TYPE).to(MailProvider);
container.bind<ICryptoInfra>(CRYPTO_INFRA_TYPE).to(CryptoInfra);
container.bind<JwtAuthMiddleware>(JwtAuthMiddleware).toSelf();
container
  .bind<IRegisterUserUseCase>(REGISTER_USER_USE_CASE_TYPE)
  .to(RegisterUserUseCase);
container.bind<RegisterUserController>(RegisterUserController).toSelf();
container.bind<ILoginUseCase>(LOGIN_USE_CASE_TYPE).to(LoginUseCase);
container.bind<LoginController>(LoginController).toSelf();
container.bind<IValidateUseCase>(VALIDATE_USE_CASE_TYPE).to(ValidateUseCase);
container.bind<ValidateController>(ValidateController).toSelf();
container
  .bind<IRegisterMonitorUseCase>(REGISTER_MONITOR_USE_CASE_TYPE)
  .to(RegisterMonitorUseCase);
container.bind<RegisterMonitorController>(RegisterMonitorController).toSelf();

export default container;
