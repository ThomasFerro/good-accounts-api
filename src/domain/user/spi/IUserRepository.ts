import { User } from '../entities/User';

export interface IUserRepository {
    findUserById(userId: string): User
};
