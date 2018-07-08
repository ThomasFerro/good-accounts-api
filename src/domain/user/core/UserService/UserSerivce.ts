import { IUserService } from '../../api/UserService/IUserService';

import { IUserRepository } from '../../spi/UserRepository/IUserRepository';

import { IEncryptionProvider } from '../../../authentication/spi/EncryptionProvider/IEncryptionProvider';

import { User } from '../entities/User/User';

export class UserService implements IUserService {
    private encryptionProvider: IEncryptionProvider;
    private userRepository: IUserRepository;

    constructor(encryptionProvider: IEncryptionProvider, userRepository: IUserRepository) {
        this.encryptionProvider = encryptionProvider;
        this.userRepository = userRepository;
    };

    searchUser(query: string): Array<User> {
        if (!query) {
            throw new Error('Invalid query');
        }

        return this.userRepository.searchUsers(query);
    };

    createUser(user: User): User {
        if (!user || !user.isValid()) {
            throw new Error('Invalid user');
        }

        if (this.userRepository.findUserByLogin(user.login)) {
            throw new Error('User already exists');
        }

        user.password = this.encryptionProvider.hashPassword(user.password);

        const createdUser: User = this.userRepository.createUser(user);
        return createdUser && createdUser.userInfo();
    };

    removeUser(userId: string): boolean {
        if (!userId) {
            throw new Error('Invalid user id');
        }

        return this.userRepository.deleteUser(userId);
    };
};
