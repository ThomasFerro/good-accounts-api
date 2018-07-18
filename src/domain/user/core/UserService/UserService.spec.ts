import { IEncryptionProvider } from '../../../authentication/spi/EncryptionProvider/IEncryptionProvider';
import { EncryptionProviderMock } from '../../../authentication/spi/EncryptionProvider/__mock__/EncryptionProviderMock';

import { IUserService } from '../../api/UserService/IUserService';
import { UserService } from './UserSerivce';
import { IUserRepository } from '../../spi/UserRepository/IUserRepository';
import { UserRepositoryMock } from '../../spi/UserRepository/__mock__/UserRepositoryMock';

import { User } from '../entities/User/User';

describe('UserService', () => {
    let encryptionProvider: IEncryptionProvider;
    let userService: IUserService;
    let userRepository: IUserRepository;

    const USER_ID = 'USER_ID';
    const USER_LOGIN = 'USER_LOGIN';
    const USER_NAME = 'USER_NAME';
    const USER_EMAIL = 'USER_EMAIL';
    const USER_PASSWORD = 'USER_PASSWORD';
    const createUser = (userName: string): User => {
        const user = new User();
        user.userId = USER_ID;
        user.login = USER_LOGIN;
        user.name = USER_NAME || userName;
        user.email = USER_EMAIL;
        user.password = USER_PASSWORD; 
        return user;
    };

    beforeEach(() => {
        encryptionProvider = new EncryptionProviderMock();
        userRepository = new UserRepositoryMock();
        userService = new UserService(encryptionProvider, userRepository);
    });

    describe('search user', () => {
        const USER_SEARCH_QUERY = 'USER_SEARCH_QUERY';

        it('should throw an error when providing no search query', async () => {
            await expect(userService.searchUser('')).rejects.toEqual(Error('Invalid query'));
        });

        it('should call the user repository to search for users', async () => {
            await userService.searchUser(USER_SEARCH_QUERY);
            expect(userRepository.searchUsers).toHaveBeenCalledWith(USER_SEARCH_QUERY);
        });

        it('should throw an error when the user search fails', async () => {
            const USER_SEARCH_ERROR = 'USER_SEARCH_ERROR';
            userRepository.searchUsers = jest.fn((query: string): Array<User> => {
                throw new Error(USER_SEARCH_ERROR);
            });

            await expect(userService.searchUser(USER_SEARCH_QUERY))
                .rejects.toEqual(Error(USER_SEARCH_ERROR));
        });
        
        it('should return the found users', async () => {
            const USERS: Array<User> = [
                createUser('USER_01'),
                createUser('USER_02'),
                createUser('USER_03')
            ];

            userRepository.searchUsers = jest.fn((query: string): Array<User> => {
                return USERS;
            });

            await expect(userService.searchUser(USER_SEARCH_QUERY)).resolves.toBe(USERS);
        });
    });

    describe('create user', () => {
        const USER: User = createUser('USER');
        const HASHED_PASSWORD: string = 'HASHED_PASSWORD';

        beforeEach(() => {
            userRepository.findUserByLogin = jest.fn((login: string): Promise<User> => {
                return null;
            });

            encryptionProvider.hashPassword = jest.fn(async (password: string): Promise<string> => {
                return HASHED_PASSWORD;
            });
        });

        it('should throw an error when providing no user', async () => {
            await expect(userService.createUser(null)).rejects.toEqual(Error('Invalid user'));
        });

        it('should call the user repository to check if the user already exists', async () => {
            await userService.createUser(USER);

            expect(userRepository.findUserByLogin).toHaveBeenCalledWith(USER.login);
        });

        it('should throw an error if the user already exists', async () => {
            userRepository.findUserByLogin = jest.fn(async (login: string): Promise<User> => {
                return USER;
            });

            await expect(userService.createUser(USER)).rejects.toEqual(Error('User already exists'));
        });

        it('should call the encryption provider to hash the password', async () => {
            await userService.createUser(USER);

            expect(encryptionProvider.hashPassword).toHaveBeenCalledWith(USER.password);
        });

        it('should throw an error if the hash fails', async () => {
            const HASH_FAILS_ERROR = 'HASH_FAILS_ERROR';

            encryptionProvider.hashPassword = jest.fn((password: string): Promise<string> => {
                throw new Error(HASH_FAILS_ERROR);
            });

            await expect(userService.createUser(USER)).rejects.toEqual(Error('HASH_FAILS_ERROR'));
        });

        it('should replace the password with the hashed one', async () => {
            await userService.createUser(USER);

            expect(USER.password).toBe(HASHED_PASSWORD);
        });

        it('should call the user repository to create the user', async () => {
            await userService.createUser(USER);

            expect(userRepository.createUser).toHaveBeenCalledWith(USER);
        });

        it('should throw an error when the user creation fails', async () => {
            const USER_CREATION_ERROR = 'USER_CREATION_ERROR';
            userRepository.createUser = jest.fn(async (user: User): Promise<User> => {
                throw new Error(USER_CREATION_ERROR);
            });

            await expect(userService.createUser(USER)).rejects.toEqual(Error(USER_CREATION_ERROR));
        });
        
        it('should return the created users\' info ', async () => {
            const CREATED_USER = createUser(USER.name);
            CREATED_USER.userId = 'USER_ID';
            userRepository.createUser = jest.fn(async (user: User): Promise<User> => {
                return CREATED_USER;
            });

            await expect(userService.createUser(USER)).resolves.toEqual(CREATED_USER.userInfo());
        });
    });

    describe('remove user', () => {
        it('should throw an error when providing no user id', async () => {
            await expect(userService.removeUser('')).rejects.toEqual(Error('Invalid user id'));
        });

        it('should call the user repository to delete the user', async () => {
            await userService.removeUser(USER_ID);

            expect(userRepository.deleteUser).toHaveBeenCalledWith(USER_ID);
        });

        it('should throw an error when the user deletion fails', async () => {
            const USER_DELETION_ERROR = 'USER_DELETION_ERROR';
            userRepository.deleteUser = jest.fn((user: User): Promise<User> => {
                throw new Error(USER_DELETION_ERROR);
            });

            await expect(userService.removeUser(USER_ID)).rejects.toEqual(Error(USER_DELETION_ERROR));
        });
        
        it('should return true if the deletion succeeds', async () => {
            userRepository.deleteUser = jest.fn(async (userId: string): Promise<boolean> => {
                return true;
            });

            await expect(userService.removeUser(USER_ID)).resolves.toBe(true);
        });
    });
});
