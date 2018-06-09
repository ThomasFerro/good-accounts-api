import { ITransactionService } from "../../api/TransactionService/ITransactionService";
import { IAccountService } from "../../../account/api/AccountService/IAccountService";

import { ITransactionRepository } from "../../spi/TransactionRepository/ITransactionRepository";

import { Transaction } from "../entities/Transaction/Transaction";

export class TransactionService implements ITransactionService {
    private transactionRepository: ITransactionRepository;
    private accountService: IAccountService;

    constructor(transactionRepository: ITransactionRepository, accountService: IAccountService) {
        this.transactionRepository = transactionRepository;
        this.accountService = accountService;
    }

    getAccountTransactions(accountId: string, userId: string): Array<Transaction> {
        if (!accountId) {
            throw new Error('Invalid account id');
        }

        if (!userId) {
            throw new Error('Invalid user id');
        }

        const account = this.accountService.getAccount(accountId, userId);
        
        return this.transactionRepository.findAllAccountsTransactions(account);
    };

    addTransactionToAccount(accountId: string, transaction: Transaction, userId: string): Transaction {
        return null;
    };

    removeTransactionFromAccount(accountId: string, transactionId: string, userId: string): boolean {
        return null;
    };
};
