import { ITransactionRepository } from '../../../domain/transaction/spi/TransactionRepository/ITransactionRepository';

import { Transaction } from '../../../domain/transaction/core/entities/Transaction/Transaction';
import { Account } from '../../../domain/account/core/entities/Account/Account';

export class InMemoryTransactionRepository implements ITransactionRepository {
    private transactions: Array<Transaction>;

    constructor() {
        this.transactions = [];
    }

    findAllAccountsTransactions(account: Account): Array<Transaction> {
        return this.transactions.filter((transaction: Transaction) => {
            return account &&
                transaction &&
                transaction.accountId === account.accountId;
        });
    }

    createTransaction(account: Account, transaction: Transaction): Transaction {
        const createdTransaction: Transaction = new Transaction();
        createdTransaction.accountId = account && account.accountId;
        createdTransaction.amount = transaction.amount;
        createdTransaction.date = transaction.date || new Date();
        createdTransaction.description = transaction.description;
        createdTransaction.name = transaction.name;
        createdTransaction.userId = transaction.userId;
        createdTransaction.transactionId = this.generateGuid();

        this.transactions.push(createdTransaction);
        return createdTransaction;
    }

    deleteTransaction(account: Account, transactionId: string): boolean {
        let success: boolean = false;
        const transactionIndex = this.transactions.findIndex((transaction: Transaction): boolean => {
            return transaction && transaction.transactionId === transactionId;
        });
        if (transactionIndex >= 0) {
            success = !!this.transactions.splice(transactionIndex, 1);
        }
        return success;
    }

    private generateGuid(): string {
        const s4 = (): string => {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
      }
};
