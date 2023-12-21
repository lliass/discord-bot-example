import container from '../../../config/inversify.config';
import JwtAuthMiddleware from './jwt-auth.middleware';

const jwtAuthMiddleware = container.get<JwtAuthMiddleware>(JwtAuthMiddleware);

export { jwtAuthMiddleware };
