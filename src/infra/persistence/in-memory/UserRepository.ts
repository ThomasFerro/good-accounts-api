import { IUserRepository } from '../../../domain/user/spi/UserRepository/IUserRepository';

import { User } from '../../../domain/user/core/entities/User/User';
import { UserRepositoryMock } from '../../../domain/user/spi/UserRepository/__mock__/UserRepositoryMock';

export class InMemoryUserRepository implements IUserRepository {
    private users: Array<User>;

    constructor() {
        this.users = [];
    };
    
    async findUserById(userId: string): Promise<User> {
        if (!userId) {
            throw new Error('Invalid user id');
        }

        return this.users.find((user: User) => {
            return user &&
                user.userId === userId;
        });
    };

    async findUserByLogin(login: string): Promise<User> {
        if (!login) {
            throw new Error('Invalid login');
        }

        return this.users.find((user: User) => {
            return user &&
                user.login === login;
        });
    };

    async searchUsers(query: string): Promise<Array<User>> {
        if (!query) {
            return [];
        }
        
        return this.users.filter((user: User) => {
            return user &&
                (user.name && user.name.toLowerCase().indexOf(query)) ||
                (user.email && user.email.toLowerCase().indexOf(query));
        });
    };

    async createUser(user: User): Promise<User> {
        const createdUser = new User(user);
        createdUser.userId = this.generateGuid();
        if (!await this.findUserByLogin(createdUser.login)) {
            this.users.push(createdUser);
            return createdUser;
        }
        return null;
    };

    async deleteUser(userId: string): Promise<boolean> {
        let success: boolean = false;
        const userIndex = this.users.findIndex((user: User): boolean => {
            return user && user.userId === userId;
        });
        if (userIndex >= 0) {
            success = !!this.users.splice(userIndex, 1);
        }
        return success;
    };

    private generateGuid(): string {
        const s4 = (): string => {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
};
