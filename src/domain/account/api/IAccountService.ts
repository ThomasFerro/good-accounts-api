import { Account } from '../entities/Account';

export interface IAccountService {
    getAllUserAccounts(userId: string): Array<Account>
};
