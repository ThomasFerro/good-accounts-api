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
    const USER_LOGIN: string = 'USER_LOGIN';
    const USER_EMAIL: string = 'USER_EMAIL';
    const USER_NAME: string = 'USER_NAME';
    const TRANSACTION_ID: string = 'TRANSACTION_ID';
    const TRANSACTION_NAME: string = 'TRANSACTION_NAME';
    const TRANSACTION_DESCRIPTION: string = 'TRANSACTION_DESCRIPTION';
    const TRANSACTION_DATE: Date = new Date();

    let ACCOUNT: Account;
    let USER: User;
    let ACCOUNT_TRANSACTIONS: Array<Transaction>;

    const createTransaction = (name: string, amount?: number, description?: string, date?: Date): Transaction => {
        const newTransaction = new Transaction({
            accountId: ACCOUNT_ID,
            userId: USER_ID,
            name: name || TRANSACTION_NAME,
            amount: amount || 42,
            description: description || TRANSACTION_DESCRIPTION,
            date: date || TRANSACTION_DATE,
        });

        return newTransaction;
    };

    beforeEach(() => {
        USER = new User();
        USER.userId = USER_ID;
        USER.login = USER_LOGIN;
        USER.email = USER_EMAIL;
        USER.name = USER_NAME;

        ACCOUNT = new Account({
            accountId: ACCOUNT_ID,
            creator: USER,
            users: [ USER ],
        });
        
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
        it('should throw an error when providing no account id', async () => {
            await expect(transactionService.getAccountTransactions('', USER_ID))
                .rejects.toEqual(Error('Invalid account id'));
        });

        it('should throw an error when providing no user id', async () => {
            await expect(transactionService.getAccountTransactions(ACCOUNT_ID, ''))
                .rejects.toEqual(Error('Invalid user id'));
        });

        it('should call the account repository to get the requested account', async () => {
            await transactionService.getAccountTransactions(ACCOUNT_ID, USER_ID);

            expect(accountServiceMock.getAccount).toHaveBeenCalledWith(ACCOUNT_ID, USER_ID);
        });

        it('should throw an error if the account fetching fails', async () => {
            const GET_ACCOUNT_ERROR = 'GET_ACCOUNT_ERROR';

            accountServiceMock.getAccount = jest.fn((accountId: string, userId: string): Account => {
                throw new Error(GET_ACCOUNT_ERROR);
            });

            await expect(transactionService.getAccountTransactions(ACCOUNT_ID, USER_ID))
                .rejects.toEqual(Error(GET_ACCOUNT_ERROR));
        });

        it('should call the transaction repository to find the account\'s transactions', async () => {
            await transactionService.getAccountTransactions(ACCOUNT_ID, USER_ID);

            expect(transactionRepositoryMock.findAllAccountsTransactions).toHaveBeenCalledWith(ACCOUNT);
        });

        it('should throw an error if the search for transactions fails', async () => {
            const TRANSACTION_SEARCH_FAILS = 'TRANSACTION_SEARCH_FAILS';
            transactionRepositoryMock.findAllAccountsTransactions = jest.fn((account: Account): Array<Transaction> => {
                throw new Error(TRANSACTION_SEARCH_FAILS);
            });
            
            await expect(transactionService.getAccountTransactions(ACCOUNT_ID, USER_ID))
                .rejects.toEqual(Error(TRANSACTION_SEARCH_FAILS));
        });

        it('should returns the account\'s transactions', () => {
            transactionRepositoryMock.findAllAccountsTransactions = jest.fn((account: Account): Array<Transaction> => {
                return ACCOUNT_TRANSACTIONS;
            });

            expect(transactionService.getAccountTransactions(ACCOUNT_ID, USER_ID)).resolves.toBe(ACCOUNT_TRANSACTIONS);
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

        it('should throw an error when providing no account id', async () => {
            await expect(transactionService.addTransactionToAccount('', NEW_TRANSACTION, USER_ID))
                .rejects.toEqual(Error('Invalid account id'));
        });

        it('should throw an error when providing no user id', async () => {
            await expect(transactionService.addTransactionToAccount(ACCOUNT_ID, NEW_TRANSACTION, ''))
                .rejects.toEqual(Error('Invalid user id'));
        });

        it('should throw an error when providing an invalid transaction', async () => {
            NEW_TRANSACTION.name = null;
            await expect(transactionService.addTransactionToAccount(ACCOUNT_ID, NEW_TRANSACTION, USER_ID))
                .rejects.toEqual(Error('Invalid transaction'));
        });

        it('should call the account repository to get the requested account', async () => {
            await transactionService.addTransactionToAccount(ACCOUNT_ID, NEW_TRANSACTION, USER_ID);

            expect(accountServiceMock.getAccount).toHaveBeenCalledWith(ACCOUNT_ID, USER_ID);
        });

        it('should throw an error if the account fetching fails', async () => {
            const GET_ACCOUNT_ERROR = 'GET_ACCOUNT_ERROR';

            accountServiceMock.getAccount = jest.fn((accountId: string, userId: string): Account => {
                throw new Error(GET_ACCOUNT_ERROR);
            });

            await expect(transactionService.addTransactionToAccount(ACCOUNT_ID, NEW_TRANSACTION, USER_ID))
                .rejects.toEqual(Error(GET_ACCOUNT_ERROR));
        });

        it('shoul call the transaction repository to create the transaction', async () => {
            await transactionService.addTransactionToAccount(ACCOUNT_ID, NEW_TRANSACTION, USER_ID);

            expect(transactionRepositoryMock.createTransaction).toHaveBeenCalledWith(ACCOUNT, NEW_TRANSACTION);
        });

        it('should throw an error if the transaction creation fails', async () => {
            const TRANSACTION_CREATION_ERROR = 'TRANSACTION_CREATION_ERROR';

            transactionRepositoryMock.createTransaction = jest.fn((account: Account, transaction: Transaction): Transaction =>  {
                throw new Error(TRANSACTION_CREATION_ERROR);
            });

            await expect(transactionService.addTransactionToAccount(ACCOUNT_ID, NEW_TRANSACTION, USER_ID))
                .rejects.toEqual(Error(TRANSACTION_CREATION_ERROR));
        });

        it('should return the created transaction if everything succeeds', () => {
            expect(transactionService.addTransactionToAccount(ACCOUNT_ID, NEW_TRANSACTION, USER_ID))
                .resolves.toBe(CREATED_TRANSACTION);
        });
    });

    describe('remove transaction', () => {
        beforeEach(() => {
            transactionRepositoryMock.deleteTransaction = jest.fn((account: Account, transactionId: string): boolean => {
                return true;
            });
        });
        
        it('should throw an error when providing no account id', async () => {
            await expect(transactionService.removeTransactionFromAccount('', TRANSACTION_ID, USER_ID))
                .rejects.toEqual(Error('Invalid account id'));
        });

        it('should throw an error when providing no user id', async () => {
            await expect(transactionService.removeTransactionFromAccount(ACCOUNT_ID, TRANSACTION_ID, ''))
                .rejects.toEqual(Error('Invalid user id'));
        });

        it('should throw an error when providing no transaction id', async () => {
            await expect(transactionService.removeTransactionFromAccount(ACCOUNT_ID, '', USER_ID))
                .rejects.toEqual(Error('Invalid transaction id'));
        });

        it('should call the transaction repository to remove the transaction', async () => {
            await transactionService.removeTransactionFromAccount(ACCOUNT_ID, TRANSACTION_ID, USER_ID);

            expect(transactionRepositoryMock.deleteTransaction).toHaveBeenCalledWith(ACCOUNT, TRANSACTION_ID);
        });

        it('should throw an error if the transaction removal fails', async () => {
            const TRANSACTION_REMOVAL_ERROR = 'TRANSACTION_REMOVAL_ERROR';

            transactionRepositoryMock.deleteTransaction = jest.fn((account: Account, transactionId: string): boolean =>  {
                throw new Error(TRANSACTION_REMOVAL_ERROR);
            });

            await expect(transactionService.removeTransactionFromAccount(ACCOUNT_ID, TRANSACTION_ID, USER_ID))
                .rejects.toEqual(Error(TRANSACTION_REMOVAL_ERROR));
        });

        it('should return true if the transaction removal succeeds', async () => {
            expect(transactionService.removeTransactionFromAccount(ACCOUNT_ID, TRANSACTION_ID, USER_ID)).resolves.toBe(true);
        });
    });
});
