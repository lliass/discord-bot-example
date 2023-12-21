import express, { Express, Router } from 'express';
import cors from 'cors';
import { apiVariables, authVariables } from '../config/variables.config';
import {
  ApplicationConfigurations,
  IApplication,
} from './common/interfaces/application.interface';
import { IController } from './common/interfaces/controller.interface';
import { healthCheckController } from './use-cases/health-check/index';
import { getMonthsOfMonitoringController } from './use-cases/monitoring/get-available-dates/index';
import { getReportHoursController } from './use-cases/monitoring/get-report-hours/index';
import { redirectAuthGoogleController } from './use-cases/auth/redirect-auth-google/index';
import { callbackAuthGoogleController } from './use-cases/auth/callback-auth-google/index';
import { HTTP_METHODS_ENUM } from './common/enums/http.enum';
import { logTool } from '../shared/tools/index';
import expressSession from 'express-session';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import JwtAuthMiddleware from './middlewares/jwt-auth/jwt-auth.middleware';
import { jwtAuthMiddleware } from './middlewares/jwt-auth';
import { registerUserController } from './use-cases/auth/register-user/index';
import { loginController } from './use-cases/auth/login/index';
import { validateController } from './use-cases/auth/validate/index';
import { registerMonitorController } from './use-cases/monitor/register-monitor/index';

export default class Application implements IApplication {
  private engine: Express = express();
  private router: Router = Router();
  private jwtAuth: JwtAuthMiddleware = jwtAuthMiddleware;
  private controllers: IController[] = [
    healthCheckController,
    getReportHoursController,
    getMonthsOfMonitoringController,
    redirectAuthGoogleController,
    callbackAuthGoogleController,
    registerUserController,
    loginController,
    validateController,
    registerMonitorController,
  ];
  private configurations: ApplicationConfigurations = {
    corsSpecification: { origin: apiVariables.allowedDomains.split(',') },
    defaultCommunication: express.json(),
    expressSession: expressSession({
      secret: authVariables.expressSessionSecretKey,
      resave: false,
      saveUninitialized: true,
    }),
    staticPassport: passport,
    prefix: 'api',
  };

  public start(): void {
    const { defaultCommunication, expressSession, staticPassport, prefix } =
      this.configurations;

    this.engine.use(cors());

    this.engine.use(defaultCommunication);

    this.engine.use(expressSession);

    this.engine.use(staticPassport.initialize());

    this.engine.use(staticPassport.session());

    staticPassport.use(
      new GoogleStrategy.Strategy(
        {
          clientID: authVariables.googleAuthClientId,
          clientSecret: authVariables.googleAuthClientSecret,
          callbackURL: authVariables.googleAuthCallbackUrl,
        },
        (accessToken, refreshToken, profile, done) => {
          return done(null, profile);
        },
      ),
    );

    staticPassport.serializeUser((user: any, done) => {
      done(null, user);
    });

    staticPassport.deserializeUser((user: any, done) => {
      done(null, user);
    });

    this.renderRoutes();

    const routes = this.router;

    this.engine.use(`/${prefix}`, routes);

    this.engine.listen(+apiVariables.port || 3000);

    logTool.dynamicMessage({
      message: 'Api has been initialized',
    });
  }

  private renderRoutes(): void {
    const { staticPassport } = this.configurations;
    try {
      for (const controller of this.controllers) {
        const { specifications } = controller;
        const expressMethod = HTTP_METHODS_ENUM[specifications.method];

        if (expressMethod) {
          const controllerHasGoogleAuth = !!specifications.googleAuthConfig;

          if (controllerHasGoogleAuth) {
            switch (specifications.googleAuthConfig) {
              case 'redirect':
                this.router[expressMethod](
                  specifications.route,
                  staticPassport.authenticate('google', {
                    scope: ['profile', 'email'],
                  }),
                  async (request, response) =>
                    controller.handle(request, response),
                );
                break;

              case 'callback':
                this.router[expressMethod](
                  specifications.route,
                  passport.authenticate('google', {
                    failureRedirect: authVariables.googleAuthRedirectFailureUrl,
                  }),
                  async (request, response) =>
                    controller.handle(request, response),
                );
                break;
            }
          } else {
            if (specifications.hasJwtAuth) {
              this.router[expressMethod](
                specifications.route,
                (request, response, next) =>
                  this.jwtAuth.active(request, response, next),
                async (request, response) =>
                  controller.handle(request, response),
              );
              continue;
            }

            this.router[expressMethod](
              specifications.route,
              async (request, response) => controller.handle(request, response),
            );
          }
        } else {
          throw new Error('An error on initialization of application routes.');
        }
      }

      logTool.dynamicMessage({
        message: 'Routes for api has defined',
      });
    } catch (error) {
      logTool.error({
        errorMessage: 'An error on render routes for api',
        errorStack: error,
      });
    }
  }
}
