import { Transaction } from '../../../core/entities/Transaction/Transaction';
import { Account } from '../../../../account/core/entities/Account/Account';

import { ITransactionRepository } from "../ITransactionRepository";

export class TransactionRepositoryMock implements ITransactionRepository {
    findAllAccountsTransactions = jest.fn((account: Account): Promise<Array<Transaction>> => {
        return null;
    });

    createTransaction = jest.fn((account: Account, transaction: Transaction): Promise<Transaction> => {
        return null;
    });

    deleteTransaction = jest.fn((account: Account, transactionId: string): Promise<boolean> => {
        return null;
    });
}