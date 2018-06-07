import { IAccountService } from '../../api/AccountService/IAccountService';
import { IAccountRepository } from '../../spi/AccountRepository/IAccountRepository';

import { User } from '../../../user/core/entities/User/User';
import { IUserRepository } from '../../../user/spi/UserRepository/IUserRepository';

export class AccountService implements IAccountService {
    private accountRepository: IAccountRepository;
    private userRepository: IUserRepository;
    
    constructor(accountRepository: IAccountRepository, userRepository: IUserRepository) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    getUser(userId: string) {
        if (!userId) {
            throw new Error('Invalid user id');
        }

        const user = this.userRepository.findUserById(userId);
        if (!user || !user.isValid()) {
            throw new Error('User not found');
        }

        return user;
    }

    getAllUserAccounts(userId: string) {
        const user = this.getUser(userId);

        return this.accountRepository.findUserAccounts(user);
    }

    getAccount(accountId: string, userId: string) {
        const user = this.getUser(userId);

        if (!accountId) {
            throw new Error('Invalid account id');
        }
        
        const account = this.accountRepository.findAccountById(accountId);
        if (!account) {
            throw new Error('Account not found');
        }

        if (!account.users ||
            !account.users.find((user) => {
                return user && user.userId === userId;
            })) {
            throw new Error('Unauthorized operation');
        }
        
        return account;
    }
};
