import { AccountService } from './AccountService';
import { AccountRepositoryMock } from '../../spi/AccountRepository/__mock__/AccountRepositoryMock';
import { UserRepositoryMock } from '../../../user/spi/UserRepository/__mock__/UserRepositoryMock';
import { Account } from '../entities/Account/Account';
import { User } from '../../../user/core/entities/User/User';

describe('AccountService', () => {
    let accountService;
    let accountRepositoryMock;
    let userRepositoryMock;

    const USER_ID = 'USER_ID';

    beforeEach(() => {
        accountRepositoryMock = new AccountRepositoryMock();
        userRepositoryMock = new UserRepositoryMock();

        userRepositoryMock.findUserById = jest.fn((userId) => {
            const user = new User();
            user.userId = userId;
            return user;
        })

        accountService = new AccountService(accountRepositoryMock, userRepositoryMock);
    });

    describe('get user accounts', () => {
        it('should throw an error when providing no user', () => {
            expect(() => {
                accountService.getAllUserAccounts('');
            }).toThrowError('Invalid user id');
        });

        it('should call the user repository to find the requested user', () => {
            accountService.getAllUserAccounts(USER_ID);
            expect(userRepositoryMock.findUserById).toHaveBeenCalledWith('USER_ID');
        });

        it('should throw an error if the requested user cannot be found', () => {
            userRepositoryMock.findUserById = jest.fn(() => {
                return null;
            })
            
            expect(() => {
                accountService.getAllUserAccounts(USER_ID);
            }).toThrowError('User not found');
        });

        it('should call the accountRepository to find the user\'s accounts', () => {
            const user = new User();
            user.userId = USER_ID;

            accountService.getAllUserAccounts(USER_ID);
            expect(accountRepositoryMock.findUserAccounts).toHaveBeenCalledWith(user);
        })

        it('should return the requested user\'s accounts', () => {
            const createAccount = (accountId) => {
                const newAccount = new Account();
                newAccount.accountId = accountId;
                return newAccount;
            }
    
            const accounts = [
                createAccount('ACCOUNT_01'),
                createAccount('ACCOUNT_02'),
                createAccount('ACCOUNT_03'),
                createAccount('ACCOUNT_04'),
            ];

            accountRepositoryMock.findUserAccounts = jest.fn(() => {
                return accounts;
            });

            expect(accountService.getAllUserAccounts(USER_ID)).toBe(accounts);
        })
    });
});
