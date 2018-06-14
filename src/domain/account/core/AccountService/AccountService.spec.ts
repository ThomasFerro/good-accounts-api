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
        const newAccount = new Account();
        newAccount.accountId = accountId;
        newAccount.name = accountName;
        newAccount.users = users;
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
            const account = new Account();
            account.accountId = accountId;
            account.name = ACCOUNT_NAME;
            const user = new User();
            user.userId = USER_ID;
            user.login = USER_LOGIN;
            user.email = USER_EMAIL;
            user.name = USER_NAME;
            account.users = [ user ];
            return account;
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
            expect(userRepositoryMock.findUserById).toHaveBeenCalledWith(USER_ID);
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
            user.login = USER_LOGIN;
            user.email = USER_EMAIL;
            user.name = USER_NAME;

            accountService.getAllUserAccounts(USER_ID);
            expect(accountRepositoryMock.findUserAccounts).toHaveBeenCalledWith(user);
        })

        it('should return the requested user\'s accounts', () => {
            const accounts = [
                createAccount({ accountId: 'ACCOUNT_01', accountName: 'ACCOUNT_01', users: null }),
                createAccount({ accountId: 'ACCOUNT_02', accountName: 'ACCOUNT_02', users: null }),
                createAccount({ accountId: 'ACCOUNT_03', accountName: 'ACCOUNT_03', users: null }),
                createAccount({ accountId: 'ACCOUNT_04', accountName: 'ACCOUNT_04', users: null }),
            ];

            accountRepositoryMock.findUserAccounts = jest.fn(() => {
                return accounts;
            });

            expect(accountService.getAllUserAccounts(USER_ID)).toBe(accounts);
        })
    });

    describe('get account details', () => {
        it('should throw an error when providing no user', () => {
            expect(() => {
                accountService.getAccount(ACCOUNT_ID, '');
            }).toThrowError('Invalid user id');
        });

        it('should throw an error when providing no account', () => {
            expect(() => {
                accountService.getAccount('', USER_ID);
            }).toThrowError('Invalid account id');
        });

        it('should call the user repository to find the requested user', () => {
            accountService.getAccount(ACCOUNT_ID, USER_ID);
            expect(userRepositoryMock.findUserById).toHaveBeenCalledWith(USER_ID);
        });

        it('should throw an error if the requested user cannot be found', () => {
            userRepositoryMock.findUserById = jest.fn(() => {
                return null;
            })
            
            expect(() => {
                accountService.getAccount(ACCOUNT_ID, USER_ID);
            }).toThrowError('User not found');
        });

        it('should call the account repository to find the requested account', () => {
            accountService.getAccount(ACCOUNT_ID, USER_ID);
            expect(accountRepositoryMock.findAccountById).toHaveBeenCalledWith(ACCOUNT_ID);
        });

        it('should throw an error if the account cannot be found', () => {
            accountRepositoryMock.findAccountById = jest.fn(() => {
                return null;
            })
            
            expect(() => {
                accountService.getAccount(ACCOUNT_ID, USER_ID);
            }).toThrowError('Account not found');
        });

        it('should throw an error if the account is invalid', () => {
            accountRepositoryMock.findAccountById = jest.fn(() => {
                return new Account();
            })
            
            expect(() => {
                accountService.getAccount(ACCOUNT_ID, USER_ID);
            }).toThrowError('Invalid account');
        });

        it('should throw an error when attempting to get an unauthorized account', () => {
            accountRepositoryMock.findAccountById = jest.fn((accountId) => {
                return createAccount({
                    accountId,
                    accountName: ACCOUNT_NAME,
                    users: null
                });
            })
            
            expect(() => {
                accountService.getAccount(ACCOUNT_ID, USER_ID);
            }).toThrowError('Unauthorized operation');
        })

        it('should return the requested account', () => {
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
            
            const account = accountService.getAccount(ACCOUNT_ID, USER_ID);
            
            expect(account).toBe(requestedAccount);
        });
    });

    describe('create account', () => {
        let newAccount: Account;
        let formattedNewAccount: Account;
        let accountCreator: User;

        beforeEach(() => {
            newAccount = new Account();
            newAccount.name = ACCOUNT_NAME;

            accountCreator = new User();
            accountCreator.userId = USER_ID;
            accountCreator.login = USER_LOGIN;
            accountCreator.email = USER_EMAIL;
            accountCreator.name = USER_NAME;

            formattedNewAccount = new Account();
            formattedNewAccount.name = ACCOUNT_NAME;
            formattedNewAccount.creator = accountCreator;
            formattedNewAccount.users = [ accountCreator ];

            accountRepositoryMock.createAccount = jest.fn((account: Account): Account => {
                return formattedNewAccount;
            })
        });

        it('should throw an error when providing no user id', () => {
            expect(() => {
                accountService.createAccount(newAccount, '');
            }).toThrowError('Invalid user id');
        });

        it('should call the user repository to find the requested user', () => {
            accountService.createAccount(newAccount, USER_ID);
            expect(userRepositoryMock.findUserById).toHaveBeenCalledWith(USER_ID);
        });

        it('should throw an error if the requested user cannot be found', () => {
            userRepositoryMock.findUserById = jest.fn(() => {
                return null;
            })
            
            expect(() => {
                accountService.createAccount(newAccount, USER_ID);
            }).toThrowError('User not found');
        });

        it('should throw an error when providing an invalid account', () => {
            newAccount.name = '';
            expect(() => {
                accountService.createAccount(newAccount, USER_ID);
            }).toThrowError('Invalid account');
        });

        it('should call the accountRepository to create the account', () => {
            accountService.createAccount(newAccount, USER_ID);

            expect(accountRepositoryMock.createAccount).toHaveBeenCalled();
        });

        it('should add the current user as the account creator and user', () => {
            accountService.createAccount(newAccount, USER_ID);
            
            expect(accountRepositoryMock.createAccount).toHaveBeenCalledWith(formattedNewAccount);
        });

        it('should throw an error if the creation fails', () => {
            accountRepositoryMock.createAccount = jest.fn((account: Account): Account => {
                throw new Error('Account creation failed');
            })

            expect(() => {
                accountService.createAccount(newAccount, USER_ID);
            }).toThrowError('Account creation failed');
        })

        it('should throw an error if the creation returns an invalid account', () => {
            accountRepositoryMock.createAccount = jest.fn((account: Account): Account => {
                return new Account();
            })

            expect(() => {
                accountService.createAccount(newAccount, USER_ID);
            }).toThrowError('Invalid created account');
        })

        it('should return the created account if the creation succeeds', () => {
            expect(accountService.createAccount(newAccount, USER_ID)).toBe(formattedNewAccount);
        });
    });

    describe('modify account', () => {
        let modifiedAccount: Account;
        let accountCreator: User;

        beforeEach(() => {
            accountCreator = new User();
            accountCreator.userId = USER_ID;
            accountCreator.login = USER_LOGIN;
            accountCreator.email = USER_EMAIL;
            accountCreator.name = USER_NAME;

            modifiedAccount = new Account();
            modifiedAccount.accountId = ACCOUNT_ID;
            modifiedAccount.name = ACCOUNT_NAME;
            modifiedAccount.creator = accountCreator;
            modifiedAccount.users = [ accountCreator ];

            accountRepositoryMock.updateAccount = jest.fn((updatedAccount: Account): Account => {
                return updatedAccount;
            });

            userRepositoryMock.findUserById = jest.fn((userId: string): User => {
                return accountCreator;
            });
        });

        it('should throw an error when providing no user id', () => {
            expect(() => {
                accountService.modifyAccount(modifiedAccount, '');
            }).toThrowError('Invalid user id');
        });

        it('should call the user repository to find the requested user', () => {
            accountService.modifyAccount(modifiedAccount, USER_ID);
            expect(userRepositoryMock.findUserById).toHaveBeenCalledWith(USER_ID);
        });

        it('should throw an error if the requested user cannot be found', () => {
            userRepositoryMock.findUserById = jest.fn(() => {
                return null;
            })
            
            expect(() => {
                accountService.modifyAccount(modifiedAccount, USER_ID);
            }).toThrowError('User not found');
        });

        it('should throw an error if the requested user isn\'t the account creator', () => {
            userRepositoryMock.findUserById = jest.fn(() => {
                const foundUser = new User();
                foundUser.userId = 'ANOTHER_USER';
                foundUser.login = USER_LOGIN;
                foundUser.email = USER_EMAIL;
                foundUser.name = USER_NAME;
                return foundUser;
            })
            
            expect(() => {
                accountService.modifyAccount(modifiedAccount, USER_ID);
            }).toThrowError('Unauthorized operation');
        });

        it('should throw an error when providing no account', () => {
            expect(() => {
                accountService.modifyAccount(null, USER_ID);
            }).toThrowError('Invalid account');
        });

        it('should throw an error when providing an account with no id', () => {
            modifiedAccount.accountId = null;
            expect(() => {
                accountService.modifyAccount(modifiedAccount, USER_ID);
            }).toThrowError('Invalid account');
        });

        it('should throw an error when modifying an invalid account', () => {
            modifiedAccount.name = null;
            expect(() => {
                accountService.modifyAccount(modifiedAccount, USER_ID);
            }).toThrowError('Invalid account');
        });

        it('should call the accountRepository to update the account', () => {
            accountService.modifyAccount(modifiedAccount, USER_ID);
            expect(accountRepositoryMock.updateAccount).toHaveBeenCalledWith(modifiedAccount);
        });

        it('should throw an error if the update fails', () => {
            accountRepositoryMock.updateAccount = jest.fn((updatedAccount: Account): Account => {
                throw new Error('Account update failed');
            });

            expect(() => {
                accountService.modifyAccount(modifiedAccount, USER_ID);
            }).toThrowError('Account update failed');
        });

        it('should throw an error if the updated account is invalid', () => {
            accountRepositoryMock.updateAccount = jest.fn((updatedAccount: Account): Account => {
                const newAccount: Account = new Account();
                return newAccount;
            });

            expect(() => {
                accountService.modifyAccount(modifiedAccount, USER_ID);
            }).toThrowError('Invalid updated account');
        });

        it('should throw an error if there is no update account', () => {
            accountRepositoryMock.updateAccount = jest.fn((updatedAccount: Account): Account => {
                return null;
            });

            expect(() => {
                accountService.modifyAccount(modifiedAccount, USER_ID);
            }).toThrowError('Invalid updated account');
        });

        it('should return the modified account if the update succeeds', () => {
            expect(accountService.modifyAccount(modifiedAccount, USER_ID)).toBe(modifiedAccount);
        });
    });

    describe('remove account', () => {
        beforeEach(() => {
            accountRepositoryMock.deleteAccount = jest.fn((accountId: string): boolean => {
                return true;
            });
        });

        it('should get the account informations', () => {
            accountService.getAccount = jest.fn();
            
            accountService.removeAccount(ACCOUNT_ID, USER_ID);

            expect(accountService.getAccount).toHaveBeenCalledWith(ACCOUNT_ID, USER_ID);
        })

        // No need to test getAccount again

        it('should throw an error if the user is not the account creator', () => {
            accountRepositoryMock.findAccountById = jest.fn((accountId: string, userId: string): Account => {
                const randomUser = new User();
                randomUser.userId = "RANDOM_USER";
                const user = new User();
                user.userId = USER_ID;
                
                const foundAccount = new Account();
                foundAccount.accountId = ACCOUNT_ID;
                foundAccount.name = ACCOUNT_NAME;
                foundAccount.creator = randomUser;
                foundAccount.users = [ randomUser, user ];

                return foundAccount;
            });

            expect(() => {
                accountService.removeAccount(ACCOUNT_ID, USER_ID);
            }).toThrowError('Unauthorized operation');
        });
        
        it('should call the account repository to remove the requested account', () => {
            accountService.removeAccount(ACCOUNT_ID, USER_ID);
            expect(accountRepositoryMock.deleteAccount).toHaveBeenCalledWith(ACCOUNT_ID);
        });

        it('should throw an error if the removal fails', () => {
            const REMOVAL_FAILS_ERROR = 'REMOVAL_FAILS_ERROR';
            
            accountRepositoryMock.deleteAccount = jest.fn((accountId: string): boolean => {
                throw new Error(REMOVAL_FAILS_ERROR);
            });

            expect(() => {
                accountService.removeAccount(ACCOUNT_ID, USER_ID);
            }).toThrowError(REMOVAL_FAILS_ERROR);
        });

        it('should return true if the removal succeeds', () => {
            expect(accountService.removeAccount(ACCOUNT_ID, USER_ID)).toBe(true);
        });
    });
});
