import { Account } from '../../entities/Account/Account';
import { User } from '../../../user/entities/User/User';

export interface IAccountRepository {
    findUserAccounts(user: User): Array<Account>
};
