import { Transaction } from '../../../core/entities/Transaction/Transaction';
import { Account } from '../../../../account/core/entities/Account/Account';

import { ITransactionRepository } from "../ITransactionRepository";

export class TransactionRepositoryMock implements ITransactionRepository {
    findAllAccountsTransactions = jest.fn((account: Account): Array<Transaction> => {
        return null;
    });

    createTransaction = jest.fn((account: Account, transaction: Transaction): Transaction => {
        return null;
    });

    deleteTransaction = jest.fn((transactionId: string): boolean => {
        return null;
    });
}