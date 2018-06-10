import { IUserRepository } from '../../../domain/user/spi/UserRepository/IUserRepository';

import { User } from '../../../domain/user/core/entities/User/User';
import { UserRepositoryMock } from '../../../domain/user/spi/UserRepository/__mock__/UserRepositoryMock';

export class InMemoryUserRepository implements IUserRepository {
    private users: Array<User>;

    constructor() {
        this.users = [];
    }
    
    findUserById(userId: string): User {
        if (!userId) {
            throw new Error('Invalid user id');
        }

        return this.users.find((user: User) => {
            return user &&
                user.userId === userId;
        });
    }
};
