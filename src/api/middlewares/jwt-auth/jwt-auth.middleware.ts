import { inject, injectable } from 'inversify';
import HttpErrorInfra from '../../infra/http-error/http.error.infra';
import { NextFunction, Request, Response } from 'express';
import { Unauthorized } from 'http-errors';
import { authVariables } from '../../../config/variables.config';
import jwt from 'jsonwebtoken';

@injectable()
export default class JwtAuthMiddleware {
  @inject(HttpErrorInfra) httpError: HttpErrorInfra;

  active(request: Request, response: Response, next: NextFunction) {
    const token = request.headers.authorization;
    try {
      if (!token) throw new Unauthorized('Token not provided!');

      const tokenIsNotBearerToken = !token.startsWith('Bearer ');

      if (tokenIsNotBearerToken)
        throw new Unauthorized('Invalid token format!');

      const tokenToBeValidated = `${token}`.split(' ')[1];

      jwt.verify(tokenToBeValidated, authVariables.jwtSecretKey, (error) => {
        if (error) throw new Unauthorized('Invalid token!');
      });

      next();
    } catch (error) {
      return this.httpError.handler(response, error);
    }
  }
}
