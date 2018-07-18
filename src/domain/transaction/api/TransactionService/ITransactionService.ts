import { Transaction } from "../../core/entities/Transaction/Transaction";

export interface ITransactionService {
    getAccountTransactions(accountId: string, userId: string): Promise<Array<Transaction>>;

    addTransactionToAccount(accountId: string, transaction: Transaction, userId: string): Promise<Transaction>;

    removeTransactionFromAccount(accountId: string, transactionId: string, userId: string): Promise<boolean>;
};
