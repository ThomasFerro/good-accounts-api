import { User } from '../../core/entities/User/User';

export interface IUserService {
    searchUser(query: string) : Promise<Array<User>>;

    createUser(user: User) : Promise<User>;

    removeUser(userId: string): Promise<boolean>;
};
