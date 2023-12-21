import * as dotenv from 'dotenv';

dotenv.config();

const discordVariables = {
  botToken: process.env.BOT_TOKEN || '',
  serverId: process.env.SERVER_ID || '',
};

const applicationVariables = {
  environment: process.env.ENVIRONMENT || 'dev',
};

const mongoDBVariables = {
  connectionUri: process.env.MONGO_DB_CONNECTION_URI || '',
  database: process.env.MONGO_DB_DATABASE || '',
  queryPermissions: process.env.MONGO_DB_QUERY_PERMISSIONS || '',
};

const apiVariables = {
  port: process.env.PORT || 3000,
  allowedDomains: process.env.ALLOWED_DOMAINS || '',
  frontEndHost: process.env.FRONT_END_HOST || '',
};

const authVariables = {
  jwtSecretKey: process.env.JWT_SECRET_KEY || '',
  expressSessionSecretKey: process.env.EXPRESS_SESSION_SECRET_KEY || '',
  googleAuthClientId: process.env.GOOGLE_AUTH_CLIENT_ID || '',
  googleAuthClientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET || '',
  googleAuthCallbackUrl: process.env.GOOGLE_AUTH_CALLBACK_URL || '',
  googleAuthRedirectFailureUrl:
    process.env.GOOGLE_AUTH_REDIRECT_FAILURE_URL || '',
  allowedEmailDomains: process.env.ALLOWED_EMAIL_DOMAINS || '',
};

const mailProviderVariables = {
  sendGridApiKey: process.env.SEND_GRID_API_KEY || '',
  defaultCommunicationMail: process.env.DEFAULT_COMMUNICATION_MAIL || '',
};

export {
  discordVariables,
  applicationVariables,
  mongoDBVariables,
  apiVariables,
  authVariables,
  mailProviderVariables,
};
