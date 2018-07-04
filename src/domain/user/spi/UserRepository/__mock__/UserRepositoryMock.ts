import { User } from '../../../core/entities/User/User';
import { IUserRepository } from '.././IUserRepository';

export class UserRepositoryMock implements IUserRepository {
    findUserById = jest.fn((userId: string): User => {
        return null;
    });

    findUserByLogin = jest.fn((login: string): User => {
        return null;
    });

    searchUsers = jest.fn((query: string): Array<User> => {
        return null;
    });

    createUser = jest.fn((user: User): User => {
        return null;
    });

    deleteUser = jest.fn((userId: string): boolean => {
        return null;
    });
};
