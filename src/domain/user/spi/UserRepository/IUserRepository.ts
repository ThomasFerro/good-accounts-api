import { User } from '../../core/entities/User/User';

export interface IUserRepository {
    findUserById(userId: string): Promise<User>;

    findUserByLogin(login: string): Promise<User>;

    searchUsers(query: string): Promise<Array<User>>;

    createUser(user: User): Promise<User>;

    deleteUser(userId: string): Promise<boolean>;
};
