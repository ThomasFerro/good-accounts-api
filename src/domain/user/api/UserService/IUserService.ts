import { User } from '../../core/entities/User/User';

export interface IUserService {
    searchUser(query: string) : Array<User>;

    createUser(user: User) : User;

    removeUser(userId: string): boolean;
};
