import { User } from '../../../core/entities/User/User';
import { IUserRepository } from '.././IUserRepository';

export class UserRepositoryMock implements IUserRepository {
    findUserById = jest.fn((userId) => {
        return null;
    })
};
