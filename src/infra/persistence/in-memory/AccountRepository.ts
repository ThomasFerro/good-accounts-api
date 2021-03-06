import { IAccountRepository } from '../../../domain/account/spi/AccountRepository/IAccountRepository';

import { Account } from '../../../domain/account/core/entities/Account/Account';
import { User } from '../../../domain/user/core/entities/User/User';

export class InMemoryAccountRepository implements IAccountRepository {
    private accounts: Array<Account>;

    constructor() {
        this.accounts = [];
    }

    async findUserAccounts(user: User): Promise<Account[]> {
        return this.accounts.filter((account: Account) => {
            return user &&
                account &&
                account.users &&
                account.users.find((accountUser: User): boolean => {
                    return accountUser && accountUser.userId === user.userId;
                });
        });
    }

    async findAccountById(accountId: string): Promise<Account> {
        if (!accountId) {
            return null;
        }
        return this.accounts.find((account: Account) => {
            return account && account.accountId === accountId;
        });
    }

    async createAccount(account: Account): Promise<Account> {
        const createAccount: Account = new Account({
            name: account.name,
            transactions: account.transactions,
            users: account.users,
            creator: account.creator,
            accountId: this.generateGuid(),
        });
        this.accounts.push(createAccount);
        return createAccount;
    }

    async updateAccount(updatedAccount: Account): Promise<Account> {
        if (!updatedAccount || !updatedAccount.accountId) {
            throw new Error('Invalid account');
        }

        const accountIndex = this.accounts.findIndex((account: Account) => {
            return account && account.accountId === updatedAccount.accountId;
        });

        if (accountIndex < 0) {
            throw new Error('Account not found');
        }

        this.accounts[accountIndex] = updatedAccount;

        return updatedAccount;
    }

    async deleteAccount(accountId: string): Promise<boolean> {
        let success: boolean = false;

        const accountIndex = this.accounts.findIndex((account: Account): boolean => {
            return account && account.accountId === accountId;
        });
        if (accountIndex >= 0) {
            success = !!this.accounts.splice(accountIndex, 1);
        }

        return success;
    }

    private generateGuid(): string {
        const s4 = (): string => {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
};
