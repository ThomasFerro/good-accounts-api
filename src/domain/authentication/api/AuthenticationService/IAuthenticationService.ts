import { IUserRepository } from '../../../user/spi/UserRepository/IUserRepository';
import { User } from '../../../user/core/entities/User/User';

export interface IAuthenticationService {
    userRepository: IUserRepository;
    
    jwtKey: string;

    decodeToken(token: string): Promise<User>;

    generateToken(username: string, password: string): Promise<string>;
};
