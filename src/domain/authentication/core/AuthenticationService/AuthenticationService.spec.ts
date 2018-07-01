import * as jsonwebtoken from 'jsonwebtoken';

import { IAuthenticationService } from '../../api/AuthenticationService/IAuthenticationService';
import { AuthenticationService } from './AuthenticationService';

import { IUserRepository } from '../../../user/spi/UserRepository/IUserRepository';
import { UserRepositoryMock } from '../../../user/spi/UserRepository/__mock__/UserRepositoryMock';
import { User } from '../../../user/core/entities/User/User';

describe('AuthenticationService', () => {
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
            const JWT_KEY = 'TEMPORARYKEY';
            const jwt = jsonwebtoken.sign({ userId: 'USER_ID' }, JWT_KEY);
            
            authenticationService.decodeToken(jwt)
                .then((user) => {
                    expect(user).toBeInstanceOf(User);
                    done();
                });
        });
    });

    describe('generateToken', () => {

    });
});
