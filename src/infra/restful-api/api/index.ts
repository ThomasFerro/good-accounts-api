import { IAuthenticationService } from '../../../domain/authentication/api/AuthenticationService/IAuthenticationService';
import { AuthenticationService } from '../../../domain/authentication/core/AuthenticationService/AuthenticationService';
import { IAccountService } from '../../../domain/account/api/AccountService/IAccountService';
import { AccountService } from '../../../domain/account/core/AccountService/AccountService';
import { ITransactionService } from '../../../domain/transaction/api/TransactionService/ITransactionService';
import { TransactionService } from '../../../domain/transaction/core/TransactionService/TransactionService';
import { IUserService } from '../../../domain/user/api/UserService/IUserService';
import { UserService } from '../../../domain/user/core/UserService/UserSerivce';

import { IAccountRepository } from '../../../domain/account/spi/AccountRepository/IAccountRepository';
import { InMemoryAccountRepository } from '../../persistence/in-memory/AccountRepository';
import { IUserRepository } from '../../../domain/user/spi/UserRepository/IUserRepository';
import { InMemoryUserRepository } from '../../persistence/in-memory/UserRepository';
import { ITransactionRepository } from '../../../domain/transaction/spi/TransactionRepository/ITransactionRepository';
import { InMemoryTransactionRepository } from '../../persistence/in-memory/TransactionRepository';

import {EncryptionProvider} from '../../encryption/EncryptionProvider';

export const accountRepository: IAccountRepository = new InMemoryAccountRepository();
export const userRepository: IUserRepository = new InMemoryUserRepository();
export const transactionRepository: ITransactionRepository = new InMemoryTransactionRepository();

export const encryptionProvider = new EncryptionProvider();

export const authenticationService: IAuthenticationService = new AuthenticationService(userRepository, encryptionProvider);
export const accountService: IAccountService = new AccountService(accountRepository, userRepository);
export const transactionService: ITransactionService = new TransactionService(transactionRepository, accountService);
export const userService: IUserService = new UserService(encryptionProvider, userRepository);
