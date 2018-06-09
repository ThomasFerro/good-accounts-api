import { IAccountRepository } from '.././IAccountRepository';

import { Account } from '../../../core/entities/Account/Account';

import { User } from '../../../../user/core/entities/User/User';

export class AccountRepositoryMock implements IAccountRepository {
    findUserAccounts = jest.fn((user: User): Array<Account> => {
        return [];
    });

    findAccountById = jest.fn((accountId: string): Account => {
        return null;
    });

    createAccount = jest.fn((account: Account): Account => {
        return null;
    });

    updateAccount = jest.fn((account: Account): Account => {
        return null;
    });
};
