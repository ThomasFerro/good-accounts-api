import { Account } from '../entities/Account';
import { User } from '../../user/entities/User';

export interface IAccountRepository {
    findUserAccounts(user: User): Array<Account>
};
