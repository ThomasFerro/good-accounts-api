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

    private async getUser(userId: string): Promise<User> {
        if (!userId) {
            throw new Error('Invalid user id');
        }

        const user = await this.userRepository.findUserById(userId);
        if (!user || !user.isValid()) {
            throw new Error('User not found');
        }

        return user && user.userInfo();
    }

    private async getAccountById(accountId: string): Promise<Account> {
        if (!accountId) {
            throw new Error('Invalid account id');
        }
        
        const account = await this.accountRepository.findAccountById(accountId);
        
        if (!account) {
            throw new Error('Account not found');
        }

        if (!account.isValid()) {
            throw new Error('Invalid account');
        }

        return account;
    };

    async getAllUserAccounts(userId: string): Promise<Array<Account>> {
        const user = await this.getUser(userId);

        return await this.accountRepository.findUserAccounts(user);
    }

    async getAccount(accountId: string, userId: string): Promise<Account> {
        await this.getUser(userId);

        const account = await this.getAccountById(accountId);

        if (!account.users ||
            !account.users.find((user) => {
                return user && user.userId === userId;
            })) {
            throw new Error('Unauthorized operation');
        }
        
        return account;
    }

    async createAccount(account: Account, userId: string): Promise<Account> {
        const user = await this.getUser(userId);

        if (!account || !account.isValid()) {
            throw new Error('Invalid account');
        }

        const newAccount = new Account({
            name: account.name,
            creator: user,
            users: [ user ],
        });

        const createAccount = await this.accountRepository.createAccount(newAccount);
        
        if (!createAccount || !createAccount.isValid()) {
            throw new Error('Invalid created account');
        }

        return createAccount;
    }

    async modifyAccount(account: Account, userId: string): Promise<Account> {
        const user = await this.getUser(userId);

        if (!account || !account.accountId || !account.isValid()) {
            throw new Error('Invalid account');
        }
        
        if (!account.creator ||
            account.creator.userId !== user.userId) {
            throw new Error('Unauthorized operation');
        }

        const updatedAccount = await this.accountRepository.updateAccount(account);

        if (!updatedAccount || !updatedAccount.isValid()) {
            throw new Error('Invalid updated account');
        }

        return updatedAccount;
    }

    async removeAccount(accountId: string, userId: string): Promise<boolean> {
        const account = await this.getAccount(accountId, userId);
        
        if (account &&
            account.creator &&
            account.creator.userId !== userId) {
            throw new Error('Unauthorized operation');
        }

        return this.accountRepository.deleteAccount(accountId);
    }
};
