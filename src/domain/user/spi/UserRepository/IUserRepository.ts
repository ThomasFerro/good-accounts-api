import { User } from '../../core/entities/User/User';

export interface IUserRepository {
    findUserById(userId: string): User;

    findUserByLogin(login: string): User;

    searchUsers(query: string): Array<User>;

    createUser(user: User): User;

    deleteUser(userId: string): boolean;
};
