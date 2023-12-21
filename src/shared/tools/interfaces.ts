interface ILogger {
  currentDate(): void;
  error(params: { errorMessage: string; errorStack: any }): void;
  dynamicMessage(params: { message: string }): void;
}

const LOGGER_TYPE = Symbol.for('ILogger');

export { ILogger, LOGGER_TYPE };
