import { ITransactionService } from '../../api/TransactionService/ITransactionService';
import { IAccountService } from '../../../account/api/AccountService/IAccountService';

import { ITransactionRepository } from '../../spi/TransactionRepository/ITransactionRepository';

import { Transaction } from '../entities/Transaction/Transaction';
import { Account } from '../../../account/core/entities/Account/Account';

export class TransactionService implements ITransactionService {
    private transactionRepository: ITransactionRepository;
    private accountService: IAccountService;

    constructor(transactionRepository: ITransactionRepository, accountService: IAccountService) {
        this.transactionRepository = transactionRepository;
        this.accountService = accountService;
    }

    private getAccount(accountId: string, userId: string): Account {
        if (!accountId) {
            throw new Error('Invalid account id');
        }

        if (!userId) {
            throw new Error('Invalid user id');
        }

        return this.accountService.getAccount(accountId, userId);
    }

    getAccountTransactions(accountId: string, userId: string): Array<Transaction> {
        const account = this.getAccount(accountId, userId);
        
        return this.transactionRepository.findAllAccountsTransactions(account);
    };

    addTransactionToAccount(accountId: string, transaction: Transaction, userId: string): Transaction {
        if (!transaction || !transaction.isValid()) {
            throw new Error('Invalid transaction');
        }
        
        const account = this.getAccount(accountId, userId);

        return this.transactionRepository.createTransaction(account, transaction);
    };

    removeTransactionFromAccount(accountId: string, transactionId: string, userId: string): boolean {
        if (!transactionId) {
            throw new Error('Invalid transaction id');
        }
        
        const account = this.getAccount(accountId, userId);
        
        return this.transactionRepository.deleteTransaction(account, transactionId);
    };
};
