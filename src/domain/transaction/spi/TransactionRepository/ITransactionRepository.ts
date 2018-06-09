import { Transaction } from '../../core/entities/Transaction/Transaction';
import { Account } from '../../../account/core/entities/Account/Account';

export interface ITransactionRepository {
    findAllAccountsTransactions(account: Account): Array<Transaction>;

    createTransaction(account: Account, transaction: Transaction): Transaction;

    deleteTransaction(transactionId: string): boolean;
};
