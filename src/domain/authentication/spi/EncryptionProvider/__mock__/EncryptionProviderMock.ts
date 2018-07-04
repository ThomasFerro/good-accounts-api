import { IEncryptionProvider } from '../IEncryptionProvider';
import { User } from '../../../../user/core/entities/User/User';

export class EncryptionProviderMock implements IEncryptionProvider {
    jwtKey: string;

    constructor() {
        this.jwtKey = "JWT_KEY";
    };

    verifyToken = jest.fn((token: string): Promise<User> => {
        return null
    });

    createToken = jest.fn((user: User): Promise<string> => {
        return null
    });

    comparePassword = jest.fn((passwordToCompare: string, user: User): Promise<string> => {
        return null
    });
}