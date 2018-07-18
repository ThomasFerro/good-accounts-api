import { Transaction } from '../../core/entities/Transaction/Transaction';
import { Account } from '../../../account/core/entities/Account/Account';

export interface ITransactionRepository {
    findAllAccountsTransactions(account: Account): Promise<Array<Transaction>>;

    createTransaction(account: Account, transaction: Transaction): Promise<Transaction>;

    deleteTransaction(account: Account, transactionId: string): Promise<boolean>;
};
