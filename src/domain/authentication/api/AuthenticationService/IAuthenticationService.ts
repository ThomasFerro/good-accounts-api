import { IUserRepository } from '../../../user/spi/UserRepository/IUserRepository';
import { User } from '../../../user/core/entities/User/User';

import { IEncryptionProvider } from '../../spi/EncryptionProvider/IEncryptionProvider';

export interface IAuthenticationService {
    userRepository: IUserRepository;

    encryptionProvider: IEncryptionProvider;
    
    decodeToken(token: string): Promise<User>;

    generateToken(username: string, password: string): Promise<string>;
};
