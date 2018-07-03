import * as jsonwebtoken from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { IAuthenticationService } from '../../api/AuthenticationService/IAuthenticationService';
import { AuthenticationService } from './AuthenticationService';

import { IUserRepository } from '../../../user/spi/UserRepository/IUserRepository';
import { UserRepositoryMock } from '../../../user/spi/UserRepository/__mock__/UserRepositoryMock';
import { User } from '../../../user/core/entities/User/User';

describe('AuthenticationService', () => {
    const JWT_KEY = 'TEMPORARYKEY';

    let authenticationService: IAuthenticationService;
    
    let userRepository: IUserRepository;

    beforeEach(() => {
        userRepository = new UserRepositoryMock();

        authenticationService = new AuthenticationService(userRepository);
    });

    describe('decodeToken', () => {
        it('should fall in catch statement if no token has been provided', (done) => {
            authenticationService.decodeToken('')
                .catch((error) => {
                    expect(error).toBe('Invalid token');
                    done();
                });
        });

        it('should fall in catch statement if the token is invalid', (done) => {
            const INVALID_TOKEN = 'INVALID_TOKEN';

            authenticationService.decodeToken(INVALID_TOKEN)
                .catch((error) => {
                    expect(error).toBeInstanceOf(jsonwebtoken.JsonWebTokenError);
                    done();
                });
        });

        it('should return user information if the token is valid', (done) => {
            const jwt = jsonwebtoken.sign({ userId: 'USER_ID' }, JWT_KEY);
            
            authenticationService.decodeToken(jwt)
                .then((user) => {
                    expect(user).toBeInstanceOf(User);
                    done();
                });
        });
    });

    describe('generateToken', () => {
        const USERNAME: string = "USERNAME";
        const PASSWORD: string = "PASSWORD";
        let user: User;
        let encryptedPassword: string;

        beforeAll((done) => {
            bcrypt.hash(PASSWORD, 12, (hashErr, hash) => {
                encryptedPassword = hash;
                user = new User({
                    login: USERNAME,
                    name: USERNAME,
                    password: encryptedPassword,
                    email: 'EMAIL',
                });
                done();
            });
        });

        beforeEach(() => {
            userRepository.findUserByLogin = jest.fn((login: string): User => {
                return user;
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

        it('should fall in catch statement if the user\'s password does not match', (done) => {
            userRepository.findUserByLogin = jest.fn((login: string): User => {
                return new User({
                    login: USERNAME,
                    name: USERNAME,
                    password: PASSWORD,
                    email: 'EMAIL'
                });
            });
            
            authenticationService.generateToken(USERNAME, PASSWORD)
                .catch((error) => {
                    expect(error).toBe('Passwords does not match');
                    done();
                });
        });

        it('should return a JWT with the user\'s information if the password matchest', (done) => {
            authenticationService.generateToken(USERNAME, PASSWORD)
                .then((jwt) => {
                    expect(new User(jsonwebtoken.decode(jwt))).toEqual(new User(user.userInfo()));
                    done();
                });
        });
    });
});
