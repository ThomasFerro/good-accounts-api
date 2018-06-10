import { Transaction } from "../../core/entities/Transaction/Transaction";

export interface ITransactionService {
    getAccountTransactions(accountId: string, userId: string): Array<Transaction>;

    addTransactionToAccount(accountId: string, transaction: Transaction, userId: string): Transaction;

    removeTransactionFromAccount(accountId: string, transactionId: string, userId: string): boolean;
};
