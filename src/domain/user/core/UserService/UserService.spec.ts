import { IUserService } from '../../api/UserService/IUserService';
import { UserService } from './UserSerivce';
import { IUserRepository } from '../../spi/UserRepository/IUserRepository';
import { UserRepositoryMock } from '../../spi/UserRepository/__mock__/UserRepositoryMock';

import { User } from '../entities/User/User';

describe('UserService', () => {
    let userService: IUserService;
    let userRepository: IUserRepository;

    const USER_ID = 'USER_ID';
    const USER_LOGIN = 'USER_LOGIN';
    const USER_NAME = 'USER_NAME';
    const USER_EMAIL = 'USER_EMAIL';
    const createUser = (userName: string): User => {
        const user = new User();
        user.userId = USER_ID;
        user.login = USER_LOGIN;
        user.name = USER_NAME || userName;
        user.email = USER_EMAIL;
        return user;
    };

    beforeEach(() => {
        userRepository = new UserRepositoryMock();
        userService = new UserService(userRepository);
    });

    describe('search user', () => {
        const USER_SEARCH_QUERY = 'USER_SEARCH_QUERY';

        it('should throw an error when providing no search query', () => {
            expect(() => {
                userService.searchUser('');
            }).toThrowError('Invalid query');
        });

        it('should call the user repository to search for users', () => {
            userService.searchUser(USER_SEARCH_QUERY);
            expect(userRepository.searchUsers).toHaveBeenCalledWith(USER_SEARCH_QUERY);
        });

        it('should throw an error when the user search fails', () => {
            const USER_SEARCH_ERROR = 'USER_SEARCH_ERROR';
            userRepository.searchUsers = jest.fn((query: string): Array<User> => {
                throw new Error(USER_SEARCH_ERROR);
            });

            expect(() => {
                userService.searchUser(USER_SEARCH_QUERY);
            }).toThrowError(USER_SEARCH_ERROR);
        });
        
        it('should return the found users', () => {
            const USERS: Array<User> = [
                createUser('USER_01'),
                createUser('USER_02'),
                createUser('USER_03')
            ];

            userRepository.searchUsers = jest.fn((query: string): Array<User> => {
                return USERS;
            });

            expect(userService.searchUser(USER_SEARCH_QUERY)).toBe(USERS);
        });
    });

    describe('create user', () => {
        const USER: User = createUser('USER');

        beforeEach(() => {
            userRepository.findUserByLogin = jest.fn((login: string): User => {
                return null;
            });
        });

        it('should throw an error when providing no user', () => {
            expect(() => {
                userService.createUser(null);
            }).toThrowError('Invalid user');
        });

        it('should call the user repository to check if the user already exists', () => {
            userService.createUser(USER);

            expect(userRepository.findUserByLogin).toHaveBeenCalledWith(USER.login);
        });

        it('should throw an error if the user already exists', () => {
            userRepository.findUserByLogin = jest.fn((login: string): User => {
                return USER;
            });

            expect(() => {
                userService.createUser(USER);
            }).toThrowError('User already exists');
        });

        it('should call the user repository to create the user', () => {
            userService.createUser(USER);

            expect(userRepository.createUser).toHaveBeenCalledWith(USER);
        });

        it('should throw an error when the user creation fails', () => {
            const USER_CREATION_ERROR = 'USER_CREATION_ERROR';
            userRepository.createUser = jest.fn((user: User): User => {
                throw new Error(USER_CREATION_ERROR);
            });

            expect(() => {
                userService.createUser(USER);
            }).toThrowError(USER_CREATION_ERROR);
        });
        
        it('should return the created users', () => {
            const CREATED_USER = createUser(USER.name);
            CREATED_USER.userId = 'USER_ID';
            userRepository.createUser = jest.fn((user: User): User => {
                return CREATED_USER;
            });

            expect(userService.createUser(USER)).toBe(CREATED_USER);
        });
    });

    describe('remove user', () => {
        it('should throw an error when providing no user id', () => {
            expect(() => {
                userService.removeUser('');
            }).toThrowError('Invalid user id');
        });

        it('should call the user repository to delete the user', () => {
            userService.removeUser(USER_ID);

            expect(userRepository.deleteUser).toHaveBeenCalledWith(USER_ID);
        });

        it('should throw an error when the user deletion fails', () => {
            const USER_DELETION_ERROR = 'USER_DELETION_ERROR';
            userRepository.deleteUser = jest.fn((user: User): User => {
                throw new Error(USER_DELETION_ERROR);
            });

            expect(() => {
                userService.removeUser(USER_ID);
            }).toThrowError(USER_DELETION_ERROR);
        });
        
        it('should return true if the deletion succeeds', () => {
            userRepository.deleteUser = jest.fn((userId: string): boolean => {
                return true;
            });

            expect(userService.removeUser(USER_ID)).toBe(true);
        });
    });
});
