import { IUserRepository } from '../../../domain/user/spi/UserRepository/IUserRepository';

import { User } from '../../../domain/user/core/entities/User/User';
import { UserRepositoryMock } from '../../../domain/user/spi/UserRepository/__mock__/UserRepositoryMock';

export class InMemoryUserRepository implements IUserRepository {
    private users: Array<User>;

    constructor() {
        this.users = [];
    };
    
    findUserById(userId: string): User {
        if (!userId) {
            throw new Error('Invalid user id');
        }

        return this.users.find((user: User) => {
            return user &&
                user.userId === userId;
        });
    };

    findUserByLogin(login: string): User {
        if (!login) {
            throw new Error('Invalid login');
        }

        

        return this.users.find((user: User) => {
            return user &&
                user.login === login;
        });
    };

    searchUsers(query: string): Array<User> {
        if (!query) {
            return [];
        }
        
        return this.users.filter((user: User) => {
            return user &&
                (user.name && user.name.toLowerCase().indexOf(query)) ||
                (user.email && user.email.toLowerCase().indexOf(query));
        });
    };

    createUser(user: User): User {
        const createdUser = new User();
        createdUser.name = user.name;
        createdUser.login = user.login;
        createdUser.email = user.email;
        createdUser.userId = this.generateGuid();
        this.users.push(createdUser);
        return createdUser;
    };

    deleteUser(userId: string): boolean {
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
