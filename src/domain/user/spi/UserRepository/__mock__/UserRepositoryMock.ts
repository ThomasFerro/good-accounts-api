import { User } from '../../../core/entities/User/User';
import { IUserRepository } from '.././IUserRepository';

export class UserRepositoryMock implements IUserRepository {
    findUserById = jest.fn((userId: string): Promise<User> => {
        return null;
    });

    findUserByLogin = jest.fn((login: string): Promise<User> => {
        return null;
    });

    searchUsers = jest.fn((query: string): Promise<Array<User>> => {
        return null;
    });

    createUser = jest.fn((user: User): Promise<User> => {
        return null;
    });

    deleteUser = jest.fn((userId: string): Promise<boolean> => {
        return null;
    });
};
