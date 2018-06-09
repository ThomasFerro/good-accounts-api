import { User } from '../../core/entities/User/User';

export interface IUserRepository {
    findUserById(userId: string): User
};
