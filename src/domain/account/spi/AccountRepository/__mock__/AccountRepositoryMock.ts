import { Account } from '../../../core/entities/Account/Account';
import { IAccountRepository } from '.././IAccountRepository';

export class AccountRepositoryMock implements IAccountRepository {
    findUserAccounts() {
        const createAccount = (accountId) => {
            const newAccount = new Account();
            newAccount.accountId = accountId;
            return newAccount;
        }

        return [
            createAccount('ACCOUNT_01'),
            createAccount('ACCOUNT_02'),
            createAccount('ACCOUNT_03'),
            createAccount('ACCOUNT_04'),
        ];
    }
};
