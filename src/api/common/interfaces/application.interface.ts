import { json } from 'express';
import session from 'express-session';
import { PassportStatic } from 'passport';

const expressJson = json();

const expressSession = session();

export interface ApplicationConfigurations {
  corsSpecification: {
    origin: string[];
  };
  defaultCommunication: typeof expressJson;
  expressSession: typeof expressSession;
  staticPassport: PassportStatic;
  prefix: string;
}

export interface IApplication {
  start(): void;
}
