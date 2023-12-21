import { isHttpError } from 'http-errors';
import { Response } from 'express';
import { ErrorPayload } from '../../common/types/error.type';
import { getReasonPhrase } from 'http-status-codes';
import { injectable } from 'inversify';

@injectable()
export default class HttpErrorInfra {
  private specifications = {
    defaultError: {
      status: 500,
      message: 'Contact our team!',
    },
  };

  handler(response: Response, error: unknown): Response {
    if (isHttpError(error)) {
      const mappedErrorPayload: ErrorPayload = {
        statusCode: error.statusCode,
        status: getReasonPhrase(error.statusCode),
        message: error.message,
      };

      return response.status(error.statusCode).json(mappedErrorPayload);
    }

    const { defaultError } = this.specifications;

    const internalServerErrorPayload: ErrorPayload = {
      statusCode: defaultError.status,
      status: getReasonPhrase(defaultError.status),
      message: defaultError.message,
    };

    return response
      .status(defaultError.status)
      .json(internalServerErrorPayload);
  }
}
