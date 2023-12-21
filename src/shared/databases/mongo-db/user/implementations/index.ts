import container from '../../../../../config/inversify.config';
import { IUserRepository, USER_REPOSITORY_TYPE } from '../Iuser.repository';

const userRepository = container.get<IUserRepository>(USER_REPOSITORY_TYPE);

export { userRepository };
