import { Account } from '../../core/entities/Account/Account';

export interface IAccountService {
    getAllUserAccounts(userId: string): Array<Account>

    getAccount(accountId: string, userId: string): Account
};
