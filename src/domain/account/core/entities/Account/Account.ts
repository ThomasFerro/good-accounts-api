import { User } from '../../../../user/core/entities/User/User';

export class Account {
    accountId: string;
    name: string;
    creator: User;
    users: Array<User>;
    // TODO : Array<Transaction>
    transactions: Array<any>;

    isValid(): boolean {
        return !!(this.accountId && this.name);
    }
};
