import { User } from '../../entities/User/User';

export interface IUserRepository {
    findUserById(userId: string): User
};
