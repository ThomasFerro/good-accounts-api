
import { Response, NextFunction } from 'express';

import { GoodAccountsRequest } from '../utils/Request';
import { GoodAccountsError } from '../utils/Error';

export const errorMiddleware = ({ errorCode, error, message }: GoodAccountsError, req: GoodAccountsRequest, res: Response, next: NextFunction) => {
    res.status(errorCode || 500).send({message, error});
};