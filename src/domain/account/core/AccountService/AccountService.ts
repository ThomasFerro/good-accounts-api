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

    getAllUserAccounts(userId: string) {
        if (!userId) {
            throw new Error('Invalid user id');
        }

        const user = this.userRepository.findUserById(userId);
        if (!user || !user.isValid()) {
            throw new Error('User not found');
        }

        return this.accountRepository.findUserAccounts(user);
    }
};
