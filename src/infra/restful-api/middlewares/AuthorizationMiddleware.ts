import { Response, NextFunction } from 'express';

import { GoodAccountsRequest } from '../utils/Request';
import { GoodAccountsError } from '../utils/Error';

import { EncryptionProvider } from '../../encryption/EncryptionProvider'
import { User } from '../../../domain/user/core/entities/User/User';

export const authorizationMiddleware = (req: GoodAccountsRequest, res: Response, next: NextFunction) => {
    // Check if the authorization header is set
    if (req.headers && req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'JWT') {

        const token: string = req.headers.authorization.split(' ')[1];

        const encryptionProvider = new EncryptionProvider();

        encryptionProvider.verifyToken(token)
            .then((user: User) => {
                req.user = user;
                next();
            })
            .catch(() => {
                next();
            });
    } else {
        next();
    }
}

export const authorizationRequired = (req: GoodAccountsRequest, res: Response, next: NextFunction) => {
    if (req.user) {
        next();
    } else {
        next(new GoodAccountsError({
            message: 'No authorized user provided',
            errorCode: 401,
        }));
    }
};