import { Request } from 'express';
import { User } from '../../../domain/user/core/entities/User/User';

export interface GoodAccountsRequest extends Request {
    user: User;
};