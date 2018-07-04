import { IAuthenticationService } from '../../api/AuthenticationService/IAuthenticationService';

import { IEncryptionProvider } from '../../spi/EncryptionProvider/IEncryptionProvider';

import { IUserRepository } from '../../../user/spi/UserRepository/IUserRepository';
import { User } from '../../../user/core/entities/User/User';

export class AuthenticationService implements IAuthenticationService {
    userRepository: IUserRepository;
    encryptionProvider: IEncryptionProvider;
    
    constructor(userRepository: IUserRepository, encryptionProvider: IEncryptionProvider) {
        this.userRepository = userRepository;
        this.encryptionProvider = encryptionProvider;
    }

    decodeToken(token: string): Promise<User> {
        return new Promise((resolve, reject) => {
            if (!token) {
                reject('Invalid token');
            }

            this.encryptionProvider.verifyToken(token)
                .then(resolve)
                .catch(reject);
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

                this.encryptionProvider.comparePassword(password, user)
                    .then(resolve)
                    .catch(reject);
            }
        });
    };
};
