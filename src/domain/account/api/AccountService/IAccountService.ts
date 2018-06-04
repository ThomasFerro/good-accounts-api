import { Account } from '../../entities/Account/Account';

export interface IAccountService {
    getAllUserAccounts(userId: string): Array<Account>
};
