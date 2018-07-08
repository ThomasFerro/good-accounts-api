import { User } from '../../../../user/core/entities/User/User';
import { Transaction } from '../../../../transaction/core/entities/Transaction/Transaction';

export class Account {
    constructor(account?: any) {
        this.accountId = account && account.accountId;
        this.name = account && account.name;
        this.creator = account && account.creator;
        this.users = account && account.users;
        this.transactions = account && account.transactions;    
    }

    accountId: string;
    name: string;
    creator: User;
    users: Array<User>;
    transactions: Array<Transaction>;

    isValid(): boolean {
        return !!this.name;
    }
};
