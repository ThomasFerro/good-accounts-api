import { IAuthenticationService } from '../../api/AuthenticationService/IAuthenticationService';
import { AuthenticationService } from './AuthenticationService';

import { IEncryptionProvider } from '../../spi/EncryptionProvider/IEncryptionProvider';
import { EncryptionProviderMock } from '../../spi/EncryptionProvider/__mock__/EncryptionProviderMock';

import { IUserRepository } from '../../../user/spi/UserRepository/IUserRepository';
import { UserRepositoryMock } from '../../../user/spi/UserRepository/__mock__/UserRepositoryMock';
import { User } from '../../../user/core/entities/User/User';

describe('AuthenticationService', () => {
    let authenticationService: IAuthenticationService;
    
    let encryptionProvider: IEncryptionProvider;

    let userRepository: IUserRepository;

    const TOKEN = 'TOKEN';

    beforeEach(() => {
        userRepository = new UserRepositoryMock();
        encryptionProvider = new EncryptionProviderMock();

        authenticationService = new AuthenticationService(userRepository, encryptionProvider);
    });

    describe('decodeToken', () => {
        it('should fall in catch statement if no token has been provided', (done) => {
            authenticationService.decodeToken('')
                .catch((error) => {
                    expect(error).toBe('Invalid token');
                    done();
                });
        });

        it('should call the encryption provider to decode the token', () => {
            authenticationService.decodeToken(TOKEN);

            expect(encryptionProvider.verifyToken).toHaveBeenCalledWith(TOKEN);
        });

        it('should fall in catch statement if the token verification fails', (done) => {
            const VERIFY_TOKEN_ERROR = 'VERIFY_TOKEN_ERROR';

            encryptionProvider.verifyToken = jest.fn((token: string): Promise<User> => {
                return new Promise<User>((resolve, reject) => {
                    reject(VERIFY_TOKEN_ERROR);
                });
            });

            authenticationService.decodeToken(TOKEN)
                .catch((error) => {
                    expect(error).toBe(VERIFY_TOKEN_ERROR);
                    done();
                });
        });

        it('should return user information if the token verification succeeds', (done) => {
            const USER = new User({
                email: "EMAIL",
                login: "LOGIN",
                name: "NAME",
            });

            encryptionProvider.verifyToken = jest.fn((token: string): Promise<User> => {
                return new Promise<User>((resolve, reject) => {
                    resolve(USER);
                });
            });
            
            authenticationService.decodeToken(TOKEN)
                .then((user) => {
                    expect(user).toBe(USER);
                    done();
                });
        });
    });

    describe('generateToken', () => {
        const USERNAME: string = "USERNAME";
        const PASSWORD: string = "PASSWORD";
        const USER: User = new User({
            login: USERNAME,
            name: USERNAME,
            password: PASSWORD,
            email: 'EMAIL',
        });

        beforeEach(() => {
            userRepository.findUserByLogin = jest.fn((login: string): User => {
                return USER;
            });
        });

        it('should fall in catch statement if no username has been provided', (done) => {
            authenticationService.generateToken('', PASSWORD)
                .catch((error) => {
                    expect(error).toBe('Invalid user name');
                    done();
                });
        });

        it('should fall in catch statement if no password has been provided', (done) => {
            authenticationService.generateToken(USERNAME, '')
                .catch((error) => {
                    expect(error).toBe('Invalid password');
                    done();
                });
        });

        it('should call the user repository to find the user', () => {
            authenticationService.generateToken(USERNAME, PASSWORD);

            expect(userRepository.findUserByLogin).toHaveBeenCalledWith(USERNAME);
        });

        it('should fall in catch statement if the user cannot be found', (done) => {
            userRepository.findUserByLogin = jest.fn((login: string): User => {
                return null;
            });

            authenticationService.generateToken(USERNAME, PASSWORD)
                .catch((error) => {
                    expect(error).toBe('User not found');
                    done();
                });
        });

        it('should call the encryption provider to compare the password', () => {
            authenticationService.generateToken(USERNAME, PASSWORD);

            expect(encryptionProvider.comparePassword).toHaveBeenCalledWith(PASSWORD, USER);
        });

        it('should fall in catch statement if the comparison fails', (done) => {
            const COMPARISON_ERROR = 'COMPARISON_ERROR';

            encryptionProvider.comparePassword = jest.fn((password: string, user: User): Promise<string> => {
                return new Promise((resolve, reject) => {
                    reject(COMPARISON_ERROR);
                });
            });
            
            authenticationService.generateToken(USERNAME, PASSWORD)
                .catch((error) => {
                    expect(error).toBe(COMPARISON_ERROR);
                    done();
                });
        });

        it('should return a JWT with the user\'s information if the comparison succeeds', (done) => {
            const JWT = 'JWT';

            encryptionProvider.comparePassword = jest.fn((password: string, user: User): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(JWT);
                });
            });

            authenticationService.generateToken(USERNAME, PASSWORD)
                .then((jwt) => {
                    expect(jwt).toEqual(JWT);
                    done();
                });
        });
    });
});
