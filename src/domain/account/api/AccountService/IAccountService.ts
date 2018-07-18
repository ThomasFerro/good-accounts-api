import { Account } from '../../core/entities/Account/Account';

export interface IAccountService {
    getAllUserAccounts(userId: string): Promise<Array<Account>>;

    getAccount(accountId: string, userId: string): Promise<Account>;

    createAccount(account: Account, userId: string): Promise<Account>;

    modifyAccount(account: Account, userId: string): Promise<Account>;

    removeAccount(accountId: string, userId: string): Promise<boolean>;
};
