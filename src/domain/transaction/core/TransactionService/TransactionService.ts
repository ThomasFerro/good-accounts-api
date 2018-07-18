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

    private async getAccount(accountId: string, userId: string): Promise<Account> {
        if (!accountId) {
            throw new Error('Invalid account id');
        }

        if (!userId) {
            throw new Error('Invalid user id');
        }

        return await this.accountService.getAccount(accountId, userId);
    }

    async getAccountTransactions(accountId: string, userId: string): Promise<Array<Transaction>> {
        const account = await this.getAccount(accountId, userId);
        
        return this.transactionRepository.findAllAccountsTransactions(account);
    };

    async addTransactionToAccount(accountId: string, transaction: Transaction, userId: string): Promise<Transaction> {
        if (!transaction || !transaction.isValid()) {
            throw new Error('Invalid transaction');
        }
        
        const account = await this.getAccount(accountId, userId);

        return this.transactionRepository.createTransaction(account, transaction);
    };

    async removeTransactionFromAccount(accountId: string, transactionId: string, userId: string): Promise<boolean> {
        if (!transactionId) {
            throw new Error('Invalid transaction id');
        }
        
        const account = await this.getAccount(accountId, userId);
        
        return this.transactionRepository.deleteTransaction(account, transactionId);
    };
};
