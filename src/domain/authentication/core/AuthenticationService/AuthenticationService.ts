import * as jsonwebtoken from 'jsonwebtoken';

import { IAuthenticationService } from '../../api/AuthenticationService/IAuthenticationService';

import { IUserRepository } from '../../../user/spi/UserRepository/IUserRepository';
import { User } from '../../../user/core/entities/User/User';

export class AuthenticationService implements IAuthenticationService {
    userRepository: IUserRepository;
    jwtKey: string;
    
    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
        this.jwtKey = 'TEMPORARYKEY';
    }

    decodeToken(token: string): Promise<User> {
        return new Promise((resolve, reject) => {
            if (!token) {
                reject('Invalid token');
            }

            jsonwebtoken.verify(token, this.jwtKey, (err, decodedToken) => {
                if (err) {
                    reject(err);
                }
                resolve(new User(decodedToken));
            });
        });
    };

    generateToken(user:User): string {
        throw new Error("Method not implemented.");
    };
};
