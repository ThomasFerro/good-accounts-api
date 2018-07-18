import { IAccountService } from '../../api/AccountService/IAccountService';
import { AccountService } from './AccountService';
import { IAccountRepository } from '../../spi/AccountRepository/IAccountRepository';
import { AccountRepositoryMock } from '../../spi/AccountRepository/__mock__/AccountRepositoryMock';
import { IUserRepository } from '../../../user/spi/UserRepository/IUserRepository';
import { UserRepositoryMock } from '../../../user/spi/UserRepository/__mock__/UserRepositoryMock';
import { Account } from '../entities/Account/Account';
import { User } from '../../../user/core/entities/User/User';

describe('AccountService', () => {
    let accountService: IAccountService;
    let accountRepositoryMock: IAccountRepository;
    let userRepositoryMock: IUserRepository;

    const USER_ID = 'USER_ID';
    const USER_NAME = 'USER_NAME';
    const USER_EMAIL = 'USER_EMAIL';
    const USER_LOGIN = 'USER_LOGIN';
    const ACCOUNT_ID = 'ACCOUNT_ID';
    const ACCOUNT_NAME = 'ACCOUNT_NAME';

    const createAccount = ({ accountId, accountName, users }) => {
        const newAccount = new Account({
            accountId: accountId,
            name: accountName,
            users: users
        });
        return newAccount;
    }

    beforeEach(() => {
        accountRepositoryMock = new AccountRepositoryMock();
        userRepositoryMock = new UserRepositoryMock();

        userRepositoryMock.findUserById = jest.fn((userId) => {
            const user = new User();
            user.userId = userId;
            user.login = USER_LOGIN;
            user.email = USER_EMAIL;
            user.name = USER_NAME;
            return user;
        })

        accountRepositoryMock.findAccountById = jest.fn((accountId) => {
            const user = new User({
                userId: USER_ID,
                login: USER_LOGIN,
                email: USER_EMAIL,
                name: USER_NAME,
            });
            const account = new Account({
                accountId: accountId,
                name: ACCOUNT_NAME,
                users: [ user ],
            });
            return account;
        })

        accountService = new AccountService(accountRepositoryMock, userRepositoryMock);
    });

    describe('get user accounts', () => {
        it('should throw an error when providing no user', async () => {
            await expect(accountService.getAllUserAccounts(''))
                .rejects.toEqual(Error('Invalid user id'));
        });

        it('should call the user repository to find the requested user', async () => {
            await accountService.getAllUserAccounts(USER_ID);
            expect(userRepositoryMock.findUserById).toHaveBeenCalledWith(USER_ID);
        });

        it('should throw an error if the requested user cannot be found', async () => {
            userRepositoryMock.findUserById = jest.fn(() => {
                return null;
            })
            
            await expect(accountService.getAllUserAccounts(USER_ID))
                .rejects.toEqual(Error('User not found'));
        });

        it('should call the accountRepository to find the user\'s accounts', async () => {
            const user = new User();
            user.userId = USER_ID;
            user.login = USER_LOGIN;
            user.email = USER_EMAIL;
            user.name = USER_NAME;

            await accountService.getAllUserAccounts(USER_ID);
            expect(accountRepositoryMock.findUserAccounts).toHaveBeenCalledWith(user);
        })

        it('should return the requested user\'s accounts', async () => {
            const accounts = [
                createAccount({ accountId: 'ACCOUNT_01', accountName: 'ACCOUNT_01', users: null }),
                createAccount({ accountId: 'ACCOUNT_02', accountName: 'ACCOUNT_02', users: null }),
                createAccount({ accountId: 'ACCOUNT_03', accountName: 'ACCOUNT_03', users: null }),
                createAccount({ accountId: 'ACCOUNT_04', accountName: 'ACCOUNT_04', users: null }),
            ];

            accountRepositoryMock.findUserAccounts = jest.fn(() => {
                return accounts;
            });

            await expect(accountService.getAllUserAccounts(USER_ID)).resolves.toBe(accounts);
        })
    });

    describe('get account details', () => {
        it('should throw an error when providing no user', async () => {
            await expect(accountService.getAccount(ACCOUNT_ID, ''))
                .rejects.toEqual(Error('Invalid user id'));
        });

        it('should throw an error when providing no account', async () => {
            await expect(accountService.getAccount('', USER_ID))
                .rejects.toEqual(Error('Invalid account id'));
        });

        it('should call the user repository to find the requested user', async () => {
            await accountService.getAccount(ACCOUNT_ID, USER_ID);
            expect(userRepositoryMock.findUserById).toHaveBeenCalledWith(USER_ID);
        });

        it('should throw an error if the requested user cannot be found', async () => {
            userRepositoryMock.findUserById = jest.fn(() => {
                return null;
            })
            
            await expect(accountService.getAccount(ACCOUNT_ID, USER_ID))
                .rejects.toEqual(Error('User not found'));
        });

        it('should call the account repository to find the requested account', async () => {
            await accountService.getAccount(ACCOUNT_ID, USER_ID);
            expect(accountRepositoryMock.findAccountById).toHaveBeenCalledWith(ACCOUNT_ID);
        });

        it('should throw an error if the account cannot be found', async () => {
            accountRepositoryMock.findAccountById = jest.fn(() => {
                return null;
            })
            
            await expect(accountService.getAccount(ACCOUNT_ID, USER_ID))
                .rejects.toEqual(Error('Account not found'));
        });

        it('should throw an error if the account is invalid', async () => {
            accountRepositoryMock.findAccountById = jest.fn(() => {
                return new Account();
            })
            
            await expect(accountService.getAccount(ACCOUNT_ID, USER_ID))
                .rejects.toEqual(Error('Invalid account'));
        });

        it('should throw an error when attempting to get an unauthorized account', async () => {
            accountRepositoryMock.findAccountById = jest.fn((accountId) => {
                return createAccount({
                    accountId,
                    accountName: ACCOUNT_NAME,
                    users: null
                });
            })
            
            await expect(accountService.getAccount(ACCOUNT_ID, USER_ID))
                .rejects.toEqual(Error('Unauthorized operation'));
        })

        it('should return the requested account', async () => {
            const user = new User();
            user.userId = USER_ID;
            let requestedAccount = createAccount({
                accountId: ACCOUNT_ID,
                accountName: ACCOUNT_NAME,
                users: [ user ],
            });
            accountRepositoryMock.findAccountById = jest.fn(() => {
                return requestedAccount;
            })
            
            const account = await accountService.getAccount(ACCOUNT_ID, USER_ID);
            
            expect(account).toBe(requestedAccount);
        });
    });

    describe('create account', () => {
        let newAccount: Account;
        let formattedNewAccount: Account;
        let accountCreator: User;

        beforeEach(() => {
            newAccount = new Account({
                name: ACCOUNT_NAME,
            });

            accountCreator = new User({
                userId: USER_ID,
                login: USER_LOGIN,
                email: USER_EMAIL,
                name: USER_NAME,
            });

            formattedNewAccount = new Account({
                name: ACCOUNT_NAME,
                creator: accountCreator,
                users: [ accountCreator ],
            });

            accountRepositoryMock.createAccount = jest.fn((account: Account): Account => {
                return formattedNewAccount;
            })
        });

        it('should throw an error when providing no user id', async () => {
            await expect(accountService.createAccount(newAccount, ''))
                .rejects.toEqual(Error('Invalid user id'));
        });

        it('should call the user repository to find the requested user', async () => {
            await accountService.createAccount(newAccount, USER_ID);
            expect(userRepositoryMock.findUserById).toHaveBeenCalledWith(USER_ID);
        });

        it('should throw an error if the requested user cannot be found', async () => {
            userRepositoryMock.findUserById = jest.fn(() => {
                return null;
            })

            await expect(accountService.createAccount(newAccount, USER_ID))
                .rejects.toEqual(Error('User not found'));
        });

        it('should throw an error when providing an invalid account', async () => {
            newAccount.name = '';
            await expect(accountService.createAccount(newAccount, USER_ID))
                .rejects.toEqual(Error('Invalid account'));
        });

        it('should call the accountRepository to create the account', async () => {
            await accountService.createAccount(newAccount, USER_ID);

            expect(accountRepositoryMock.createAccount).toHaveBeenCalled();
        });

        it('should add the current user as the account creator and user', async () => {
            await accountService.createAccount(newAccount, USER_ID);
            
            expect(accountRepositoryMock.createAccount).toHaveBeenCalledWith(formattedNewAccount);
        });

        it('should throw an error if the creation fails', async () => {
            accountRepositoryMock.createAccount = jest.fn((account: Account): Account => {
                throw new Error('Account creation failed');
            })
            
            await expect(accountService.createAccount(newAccount, USER_ID))
                .rejects.toEqual(Error('Account creation failed'));
        })

        it('should throw an error if the creation returns an invalid account', async () => {
            accountRepositoryMock.createAccount = jest.fn((account: Account): Account => {
                return new Account();
            })

            await expect(accountService.createAccount(newAccount, USER_ID))
                .rejects.toEqual(Error('Invalid created account'));
        })

        it('should return the created account if the creation succeeds', async () => {
            expect(accountService.createAccount(newAccount, USER_ID)).resolves.toBe(formattedNewAccount);
        });
    });

    describe('modify account', () => {
        let modifiedAccount: Account;
        let accountCreator: User;

        beforeEach(() => {
            accountCreator = new User({
                userId: USER_ID,
                login: USER_LOGIN,
                email: USER_EMAIL,
                name: USER_NAME,
            });

            modifiedAccount = new Account({
                accountId: ACCOUNT_ID,
                name: ACCOUNT_NAME,
                creator: accountCreator,
                users: [ accountCreator ],
            });

            accountRepositoryMock.updateAccount = jest.fn((updatedAccount: Account): Account => {
                return updatedAccount;
            });

            userRepositoryMock.findUserById = jest.fn((userId: string): User => {
                return accountCreator;
            });
        });

        it('should throw an error when providing no user id', async () => {
            await expect(accountService.modifyAccount(modifiedAccount, ''))
                .rejects.toEqual(Error('Invalid user id'));
        });

        it('should call the user repository to find the requested user', async() => {
            await accountService.modifyAccount(modifiedAccount, USER_ID);
            expect(userRepositoryMock.findUserById).toHaveBeenCalledWith(USER_ID);
        });

        it('should throw an error if the requested user cannot be found', async () => {
            userRepositoryMock.findUserById = jest.fn(() => {
                return null;
            })
            
            await expect(accountService.modifyAccount(modifiedAccount, USER_ID))
                .rejects.toEqual(Error('User not found'));
        });

        it('should throw an error if the requested user isn\'t the account creator', async () => {
            userRepositoryMock.findUserById = jest.fn(() => {
                const foundUser = new User();
                foundUser.userId = 'ANOTHER_USER';
                foundUser.login = USER_LOGIN;
                foundUser.email = USER_EMAIL;
                foundUser.name = USER_NAME;
                return foundUser;
            })
            
            await expect(accountService.modifyAccount(modifiedAccount, USER_ID))
                .rejects.toEqual(Error('Unauthorized operation'));
        });

        it('should throw an error when providing no account', async () => {
            await expect(accountService.modifyAccount(null, USER_ID))
                .rejects.toEqual(Error('Invalid account'));
        });

        it('should throw an error when providing an account with no id', async () => {
            modifiedAccount.accountId = null;
            await expect(accountService.modifyAccount(modifiedAccount, USER_ID))
                .rejects.toEqual(Error('Invalid account'));
        });

        it('should throw an error when modifying an invalid account', async () => {
            modifiedAccount.name = null;
            await expect(accountService.modifyAccount(modifiedAccount, USER_ID))
                .rejects.toEqual(Error('Invalid account'));
        });

        it('should call the accountRepository to update the account', async () => {
            await accountService.modifyAccount(modifiedAccount, USER_ID);
            expect(accountRepositoryMock.updateAccount).toHaveBeenCalledWith(modifiedAccount);
        });

        it('should throw an error if the update fails', async () => {
            accountRepositoryMock.updateAccount = jest.fn((updatedAccount: Account): Account => {
                throw new Error('Account update failed');
            });

            await expect(accountService.modifyAccount(modifiedAccount, USER_ID))
                .rejects.toEqual(Error('Account update failed'));
        });

        it('should throw an error if the updated account is invalid', async () => {
            accountRepositoryMock.updateAccount = jest.fn((updatedAccount: Account): Account => {
                return new Account();
            });

            await expect(accountService.modifyAccount(modifiedAccount, USER_ID))
                .rejects.toEqual(Error('Invalid updated account'));
        });

        it('should throw an error if there is no update account', async () => {
            accountRepositoryMock.updateAccount = jest.fn((updatedAccount: Account): Account => {
                return null;
            });

            await expect(accountService.modifyAccount(modifiedAccount, USER_ID))
                .rejects.toEqual(Error('Invalid updated account'));
        });

        it('should return the modified account if the update succeeds', async () => {
            expect(accountService.modifyAccount(modifiedAccount, USER_ID)).resolves.toBe(modifiedAccount);
        });
    });

    describe('remove account', () => {
        beforeEach(() => {
            accountRepositoryMock.deleteAccount = jest.fn((accountId: string): boolean => {
                return true;
            });
        });

        it('should get the account informations', async () => {
            accountService.getAccount = jest.fn();
            
            await accountService.removeAccount(ACCOUNT_ID, USER_ID);

            expect(accountService.getAccount).toHaveBeenCalledWith(ACCOUNT_ID, USER_ID);
        })

        // No need to test getAccount again

        it('should throw an error if the user is not the account creator', async () => {
            accountRepositoryMock.findAccountById = jest.fn((accountId: string, userId: string): Account => {
                const randomUser = new User();
                randomUser.userId = "RANDOM_USER";
                const user = new User();
                user.userId = USER_ID;
                
                const foundAccount = new Account({
                    accountId: ACCOUNT_ID,
                    name: ACCOUNT_NAME,
                    creator: randomUser,
                    users: [ randomUser, user ],
                });

                return foundAccount;
            });

            await expect(accountService.removeAccount(ACCOUNT_ID, USER_ID))
                .rejects.toEqual(Error('Unauthorized operation'));
        });
        
        it('should call the account repository to remove the requested account', async () => {
            await accountService.removeAccount(ACCOUNT_ID, USER_ID);
            expect(accountRepositoryMock.deleteAccount).toHaveBeenCalledWith(ACCOUNT_ID);
        });

        it('should throw an error if the removal fails', async () => {
            const REMOVAL_FAILS_ERROR = 'REMOVAL_FAILS_ERROR';
            
            accountRepositoryMock.deleteAccount = jest.fn((accountId: string): boolean => {
                throw new Error(REMOVAL_FAILS_ERROR);
            });

            await expect(accountService.removeAccount(ACCOUNT_ID, USER_ID))
                .rejects.toEqual(Error(REMOVAL_FAILS_ERROR));
        });

        it('should return true if the removal succeeds', async () => {
            expect(accountService.removeAccount(ACCOUNT_ID, USER_ID)).resolves.toBe(true);
        });
    });
});
