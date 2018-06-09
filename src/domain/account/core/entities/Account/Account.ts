import { User } from '../../../../user/core/entities/User/User';
import { Transaction } from '../../../../transaction/core/entities/Transaction/Transaction';

export class Account {
    accountId: string;
    name: string;
    creator: User;
    users: Array<User>;
    transactions: Array<Transaction>;

    isValid(): boolean {
        return !!this.name;
    }
};
