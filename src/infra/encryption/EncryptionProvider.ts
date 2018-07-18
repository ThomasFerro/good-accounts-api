import * as jsonwebtoken from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { IEncryptionProvider } from "../../domain/authentication/spi/EncryptionProvider/IEncryptionProvider";

import { User } from "../../domain/user/core/entities/User/User";

export class EncryptionProvider implements IEncryptionProvider {
    jwtKey: string;

    constructor() {
        this.jwtKey = 'TEMPORARYKEY';
    };
    
    verifyToken(token: string): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            try {
                jsonwebtoken.verify(token, this.jwtKey, (err, decodedToken) => {
                    if (err) {
                        reject('An error has occurred while verifying the JWT: ' + err && err.message);
                    }
                    resolve(new User(decodedToken));
                });
            } catch (e) {
                reject('An error has occurred while verifying the JWT: ' + e && e.toString());
            }
        });
    };

    createToken(user: User): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                return jsonwebtoken.sign(user.userInfo(), this.jwtKey);
            } catch (e) {
                reject('An error has occurred while creating the JWT: ' + e && e.toString());
            }
        });
    }

    comparePassword(passwordToCompare: string, user: User): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                bcrypt.compare(passwordToCompare, user.password, (compareError, compareResult) => {
                    if (!compareResult) {
                        reject('Passwords does not match');
                    } else {
                        resolve(jsonwebtoken.sign(user.userInfo(), this.jwtKey));
                    }
                });
            } catch (e) {
                reject('An error has occured while comparing the passwords: ' + e && e.toString());
            }
        });
    };

    async hashPassword(password: string): Promise<string> {
        try {
            // TODO: Use the async method
            return bcrypt.hashSync(password, 12);
        } catch (e) {
            throw new Error ('An error has occurred while hashing the password: ' + e && e.toString());
        }
    };
}