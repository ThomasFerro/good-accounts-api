import { IAccountService } from '../../api/AccountService/IAccountService';
import { IAccountRepository } from '../../spi/AccountRepository/IAccountRepository';

import { User } from '../../../user/entities/User/User';
import { IUserRepository } from '../../../user/spi/UserRepository/IUserRepository';

export class AccountService implements IAccountService {
    private accountRepository: IAccountRepository;
    private userRepository: IUserRepository;
    
    constructor(accountRepository: IAccountRepository) {
        this.accountRepository = accountRepository;
    }

    getAllUserAccounts(userId: string) {
        if (!userId) {
            // TODO : Throw InvalidUserId exception
            throw new Error('InvalidUserId');
        }

        const user = this.userRepository.findUserById(userId);
        if (!user || !user.isValid()) {
            // TODO : Thow UserNotFound exception
            throw new Error('UserNotFound');
        }

        return this.accountRepository.findUserAccounts(user);
    }
};
