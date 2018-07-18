import { Account } from '../../core/entities/Account/Account';
import { User } from '../../../user/core/entities/User/User';

export interface IAccountRepository {
    findUserAccounts(user: User): Promise<Array<Account>>;

    findAccountById(accountId: string): Promise<Account>;
    
    createAccount(account: Account): Promise<Account>;
    
    updateAccount(account: Account): Promise<Account>;

    deleteAccount(accountId: string): Promise<boolean>;
};
