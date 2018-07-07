import { IAccountService } from '../../api/AccountService/IAccountService';
import { IAccountRepository } from '../../spi/AccountRepository/IAccountRepository';

import { Account } from '../entities/Account/Account';

import { User } from '../../../user/core/entities/User/User';
import { IUserRepository } from '../../../user/spi/UserRepository/IUserRepository';

export class AccountService implements IAccountService {
    private accountRepository: IAccountRepository;
    private userRepository: IUserRepository;
    
    constructor(accountRepository: IAccountRepository, userRepository: IUserRepository) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    getUser(userId: string): User {
        if (!userId) {
            throw new Error('Invalid user id');
        }

        const user = this.userRepository.findUserById(userId);
        if (!user || !user.isValid()) {
            throw new Error('User not found');
        }

        return user;
    }

    getAllUserAccounts(userId: string): Array<Account> {
        const user = this.getUser(userId);

        return this.accountRepository.findUserAccounts(user);
    }

    getAccount(accountId: string, userId: string): Account {
        const user = this.getUser(userId);

        if (!accountId) {
            throw new Error('Invalid account id');
        }
        
        const account = this.accountRepository.findAccountById(accountId);
        
        if (!account) {
            throw new Error('Account not found');
        }

        if (!account.isValid()) {
            throw new Error('Invalid account');
        }

        if (!account.users ||
            !account.users.find((user) => {
                return user && user.userId === userId;
            })) {
            throw new Error('Unauthorized operation');
        }
        
        return account;
    }

    createAccount(account: Account, userId: string): Account {
        const user = this.getUser(userId);

        if (!account || !account.isValid()) {
            throw new Error('Invalid account');
        }

        const newAccount = new Account({
            name: account.name,
            creator: user,
            users: [ user ],
        });

        const createAccount = this.accountRepository.createAccount(newAccount);
        
        if (!createAccount || !createAccount.isValid()) {
            throw new Error('Invalid created account');
        }

        return createAccount;
    }

    modifyAccount(account: Account, userId: string): Account {
        const user = this.getUser(userId);

        if (!account || !account.accountId || !account.isValid()) {
            throw new Error('Invalid account');
        }
        
        if (!account.creator ||
            account.creator.userId !== user.userId) {
            throw new Error('Unauthorized operation');
        }

        const updatedAccount = this.accountRepository.updateAccount(account);

        if (!updatedAccount || !updatedAccount.isValid()) {
            throw new Error('Invalid updated account');
        }

        return updatedAccount;
    }

    removeAccount(accountId: string, userId: string): boolean {
        const account = this.getAccount(accountId, userId);
        
        if (account &&
            account.creator &&
            account.creator.userId !== userId) {
            throw new Error('Unauthorized operation');
        }

        return this.accountRepository.deleteAccount(accountId);
    }
};
