import { IAuthenticationService } from '../../api/AuthenticationService/IAuthenticationService';
import { AuthenticationService } from './AuthenticationService';

import { IEncryptionProvider } from '../../spi/EncryptionProvider/IEncryptionProvider';
import { EncryptionProviderMock } from '../../spi/EncryptionProvider/__mock__/EncryptionProviderMock';

import { IUserRepository } from '../../../user/spi/UserRepository/IUserRepository';
import { UserRepositoryMock } from '../../../user/spi/UserRepository/__mock__/UserRepositoryMock';
import { User } from '../../../user/core/entities/User/User';
import { resolve } from 'path';

describe('AuthenticationService', () => {
    let authenticationService: IAuthenticationService;
    
    let encryptionProvider: IEncryptionProvider;

    let userRepository: IUserRepository;

    const TOKEN = 'TOKEN';

    beforeEach(() => {
        userRepository = new UserRepositoryMock();
        encryptionProvider = new EncryptionProviderMock();

        authenticationService = new AuthenticationService(userRepository, encryptionProvider);

        encryptionProvider.verifyToken = jest.fn((token: string) : Promise<User> => {
            return new Promise((resolve, reject) => { resolve(); });
        });
    });

    describe('decodeToken', () => {
        it('should fall in catch statement if no token has been provided', async () => {
            await expect(authenticationService.decodeToken('')).rejects.toBe('Invalid token');
        });

        it('should call the encryption provider to decode the token', async () => {
            await authenticationService.decodeToken(TOKEN);

            expect(encryptionProvider.verifyToken).toHaveBeenCalledWith(TOKEN);
        });

        it('should fall in catch statement if the token verification fails', async () => {
            const VERIFY_TOKEN_ERROR = 'VERIFY_TOKEN_ERROR';

            encryptionProvider.verifyToken = jest.fn((token: string): Promise<User> => {
                throw Error(VERIFY_TOKEN_ERROR);
            });

            await expect(authenticationService.decodeToken(TOKEN)).rejects.toEqual(Error(VERIFY_TOKEN_ERROR));
        });

        it('should return user information if the token verification succeeds', async () => {
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
            
            await expect(authenticationService.decodeToken(TOKEN)).resolves.toBe(USER);
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

        it('should fall in catch statement if no username has been provided', async () => {
            await expect(authenticationService.generateToken('', PASSWORD)).rejects.toEqual(Error('Invalid user name'));
        });

        it('should fall in catch statement if no password has been provided', async () => {
            await expect(authenticationService.generateToken(USERNAME, '')).rejects.toEqual(Error('Invalid password'));
        });

        it('should call the user repository to find the user', async () => {
            await authenticationService.generateToken(USERNAME, PASSWORD);

            expect(userRepository.findUserByLogin).toHaveBeenCalledWith(USERNAME);
        });

        it('should fall in catch statement if the user cannot be found', async () => {
            userRepository.findUserByLogin = jest.fn((login: string): User => {
                return null;
            });

            await expect(authenticationService.generateToken(USERNAME, PASSWORD)).rejects.toEqual(Error('User not found'));
        });

        it('should call the encryption provider to compare the password', async () => {
            await authenticationService.generateToken(USERNAME, PASSWORD);

            expect(encryptionProvider.comparePassword).toHaveBeenCalledWith(PASSWORD, USER);
        });

        it('should fall in catch statement if the comparison fails', async () => {
            const COMPARISON_ERROR = 'COMPARISON_ERROR';

            encryptionProvider.comparePassword = jest.fn((password: string, user: User): Promise<string> => {
                throw Error(COMPARISON_ERROR);
            });
            
            await expect(authenticationService.generateToken(USERNAME, PASSWORD)).rejects.toEqual(Error(COMPARISON_ERROR));
        });

        it('should return a JWT with the user\'s information if the comparison succeeds', async () => {
            const JWT = 'JWT';

            encryptionProvider.comparePassword = jest.fn((password: string, user: User): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(JWT);
                });
            });

            await expect(authenticationService.generateToken(USERNAME, PASSWORD)).resolves.toBe(JWT);
        });
    });
});
