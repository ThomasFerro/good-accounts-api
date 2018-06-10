import { ITransactionService } from '../../api/TransactionService/ITransactionService';
import { TransactionService } from './TransactionService';

import { ITransactionRepository } from '../../spi/TransactionRepository/ITransactionRepository';
import { TransactionRepositoryMock } from '../../spi/TransactionRepository/__mock__/TransactionRepositoryMock';

import { Transaction } from '../entities/Transaction/Transaction';

import { IAccountService } from '../../../account/api/AccountService/IAccountService';
import { AccountServiceMock } from '../../../account/core/AccountService/__mock__/AccountServiceMock';

import { Account } from '../../../account/core/entities/Account/Account';

import { User } from '../../../user/core/entities/User/User';

describe('TransactionService', () => {
    let transactionService: ITransactionService;
    let transactionRepositoryMock: ITransactionRepository;
    let accountServiceMock: IAccountService;

    const ACCOUNT_ID: string = 'ACCOUNT_ID';
    const USER_ID: string = 'USER_ID';
    const TRANSACTION_NAME: string = 'TRANSACTION_NAME';
    const TRANSACTION_DESCRIPTION: string = 'TRANSACTION_DESCRIPTION';
    const TRANSACTION_DATE: Date = new Date();

    let ACCOUNT: Account;
    let USER: User;
    let ACCOUNT_TRANSACTIONS: Array<Transaction>;

    const createTransaction = (name: string, amount?: number, description?: string, date?: Date): Transaction => {
        const newTransaction = new Transaction();

        newTransaction.accountId = ACCOUNT_ID;
        newTransaction.userId = USER_ID;
        newTransaction.name = name || TRANSACTION_NAME;
        newTransaction.amount = amount || 42;
        newTransaction.description = description || TRANSACTION_DESCRIPTION;
        newTransaction.date = date || TRANSACTION_DATE;

        return newTransaction;
    };

    beforeEach(() => {
        USER = new User();
        USER.userId = USER_ID;

        ACCOUNT = new Account();
        ACCOUNT.accountId = ACCOUNT_ID;
        ACCOUNT.creator = USER;
        ACCOUNT.users = [ USER ];
        
        ACCOUNT_TRANSACTIONS = [
            createTransaction('TRANSACTION_01'),
            createTransaction('TRANSACTION_02'),
            createTransaction('TRANSACTION_03')
        ];

        transactionRepositoryMock = new TransactionRepositoryMock();
        accountServiceMock = new AccountServiceMock();
        transactionService = new TransactionService(transactionRepositoryMock, accountServiceMock);

        accountServiceMock.getAccount = jest.fn((accountId: string, userId: string): Account => {
            return ACCOUNT;
        });
    });

    describe('get account transactions', () => {
        it('should throw an error when providing no account id', () => {
            expect(() => {
                transactionService.getAccountTransactions('', USER_ID);
            }).toThrowError('Invalid account id');
        });

        it('should throw an error when providing no user id', () => {
            expect(() => {
                transactionService.getAccountTransactions(ACCOUNT_ID, '');
            }).toThrowError('Invalid user id');
        });

        it('should call the account repository to get the requested account', () => {
            transactionService.getAccountTransactions(ACCOUNT_ID, USER_ID);

            expect(accountServiceMock.getAccount).toHaveBeenCalledWith(ACCOUNT_ID, USER_ID);
        });

        it('should throw an error if the account fetching fails', () => {
            const GET_ACCOUNT_ERROR = 'GET_ACCOUNT_ERROR';

            accountServiceMock.getAccount = jest.fn((accountId: string, userId: string): Account => {
                throw new Error(GET_ACCOUNT_ERROR);
            });

            expect(() => {
                transactionService.getAccountTransactions(ACCOUNT_ID, USER_ID);
            }).toThrowError(GET_ACCOUNT_ERROR);
        });

        it('should call the transaction repository to find the account\'s transactions', () => {
            transactionService.getAccountTransactions(ACCOUNT_ID, USER_ID);

            expect(transactionRepositoryMock.findAllAccountsTransactions).toHaveBeenCalledWith(ACCOUNT);
        });

        it('should throw an error if the search for transactions fails', () => {
            const TRANSACTION_SEARCH_FAILS = 'TRANSACTION_SEARCH_FAILS';
            transactionRepositoryMock.findAllAccountsTransactions = jest.fn((account: Account): Array<Transaction> => {
                throw new Error(TRANSACTION_SEARCH_FAILS);
            });
            
            expect(() => {
                transactionService.getAccountTransactions(ACCOUNT_ID, USER_ID);
            }).toThrowError(TRANSACTION_SEARCH_FAILS);
        });

        it('should returns the account\'s transactions', () => {
            transactionRepositoryMock.findAllAccountsTransactions = jest.fn((account: Account): Array<Transaction> => {
                return ACCOUNT_TRANSACTIONS;
            });

            expect(transactionService.getAccountTransactions(ACCOUNT_ID, USER_ID)).toBe(ACCOUNT_TRANSACTIONS);
        });
    });

    describe('add transaction to account', () => {
        const NEW_TRANSACTION_NAME: string = 'NEW_TRANSACTION_NAME';
        const CREATED_TRANSACTION_ID: string = 'CREATED_TRANSACTION_ID';
        let NEW_TRANSACTION: Transaction;
        let CREATED_TRANSACTION: Transaction;

        beforeEach(() => {
            NEW_TRANSACTION = createTransaction(NEW_TRANSACTION_NAME);
            CREATED_TRANSACTION = createTransaction(NEW_TRANSACTION_NAME);
            CREATED_TRANSACTION.transactionId = CREATED_TRANSACTION_ID; 

            transactionRepositoryMock.createTransaction = jest.fn((account: Account, transaction: Transaction): Transaction => {
                return CREATED_TRANSACTION;
            });
        });

        it('should throw an error when providing no account id', () => {
            expect(() => {
                transactionService.addTransactionToAccount('', NEW_TRANSACTION, USER_ID);
            }).toThrowError('Invalid account id');
        });

        it('should throw an error when providing no user id', () => {
            expect(() => {
                transactionService.addTransactionToAccount(ACCOUNT_ID, NEW_TRANSACTION, '');
            }).toThrowError('Invalid user id');
        });

        it('should throw an error when providing an invalid transaction', () => {
            expect(() => {
                NEW_TRANSACTION.name = null;
                transactionService.addTransactionToAccount(ACCOUNT_ID, NEW_TRANSACTION, USER_ID);
            }).toThrowError('Invalid transaction');
        });

        it('should call the account repository to get the requested account', () => {
            transactionService.addTransactionToAccount(ACCOUNT_ID, NEW_TRANSACTION, USER_ID);

            expect(accountServiceMock.getAccount).toHaveBeenCalledWith(ACCOUNT_ID, USER_ID);
        });

        it('should throw an error if the account fetching fails', () => {
            const GET_ACCOUNT_ERROR = 'GET_ACCOUNT_ERROR';

            accountServiceMock.getAccount = jest.fn((accountId: string, userId: string): Account => {
                throw new Error(GET_ACCOUNT_ERROR);
            });

            expect(() => {
                transactionService.addTransactionToAccount(ACCOUNT_ID, NEW_TRANSACTION, USER_ID);
            }).toThrowError(GET_ACCOUNT_ERROR);
        });

        it('shoul call the transaction repository to create the transaction', () => {
            transactionService.addTransactionToAccount(ACCOUNT_ID, NEW_TRANSACTION, USER_ID);

            expect(transactionRepositoryMock.createTransaction).toHaveBeenCalledWith(ACCOUNT, NEW_TRANSACTION);
        });

        it('should throw an error if the transaction creation fails', () => {
            const TRANSACTION_CREATION_ERROR = 'TRANSACTION_CREATION_ERROR';

            transactionRepositoryMock.createTransaction = jest.fn((account: Account, transaction: Transaction): Transaction =>  {
                throw new Error(TRANSACTION_CREATION_ERROR);
            });

            expect(() => {
                transactionService.addTransactionToAccount(ACCOUNT_ID, NEW_TRANSACTION, USER_ID);
            }).toThrowError(TRANSACTION_CREATION_ERROR);
        });

        it('should return the created transaction if everything succeeds', () => {
            expect(transactionService.addTransactionToAccount(ACCOUNT_ID, NEW_TRANSACTION, USER_ID)).toBe(CREATED_TRANSACTION);
        });
    });

    describe('remove transaction', () => {

    });
});
