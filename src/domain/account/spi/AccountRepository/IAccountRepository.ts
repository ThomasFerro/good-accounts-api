import { Account } from '../../core/entities/Account/Account';
import { User } from '../../../user/core/entities/User/User';

export interface IAccountRepository {
    findUserAccounts(user: User): Array<Account>
};
