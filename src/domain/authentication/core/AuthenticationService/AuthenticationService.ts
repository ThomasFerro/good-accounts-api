// TODO: Extract in encryption SPI
import * as jsonwebtoken from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

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

    generateToken(username: string, password: string): Promise<string> {
        return new Promise((resolve, reject) => {

            if (!username) {
                reject('Invalid user name');
            } else if (!password) {
                reject('Invalid password');
            } else {

                const user = this.userRepository.findUserByLogin(username);
                
                if (!user || !user.isValid()) {
                    reject('User not found');
                }
    
                bcrypt.compare(password, user.password, (compareError, compareResult) => {

                    if (!compareResult) {
                        reject('Passwords does not match');
                    } else {
                        resolve(jsonwebtoken.sign(user.userInfo(), this.jwtKey));
                    }
                });
            }
        });
    };
};
