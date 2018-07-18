import { User } from "../../../user/core/entities/User/User";

export interface IEncryptionProvider {
    jwtKey: string;

    verifyToken(token: string): Promise<User>;

    createToken(user: User): Promise<string>;

    comparePassword(passwordToCompare: string, user: User): Promise<string>;

    hashPassword(password: string): Promise<string>;
};
