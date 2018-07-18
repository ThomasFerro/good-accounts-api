import { IAccountRepository } from '.././IAccountRepository';

import { Account } from '../../../core/entities/Account/Account';

import { User } from '../../../../user/core/entities/User/User';

export class AccountRepositoryMock implements IAccountRepository {
    findUserAccounts = jest.fn((user: User): Promise<Array<Account>> => {
        return null;
    });

    findAccountById = jest.fn((accountId: string): Promise<Account> => {
        return null;
    });

    createAccount = jest.fn((account: Account): Promise<Account> => {
        return null;
    });

    updateAccount = jest.fn((account: Account): Promise<Account> => {
        return null;
    });

    deleteAccount = jest.fn((accountId: string, userId: string): Promise<boolean> => {
        return null;
    });
};
