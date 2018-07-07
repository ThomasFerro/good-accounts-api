export class Transaction {
    constructor(transaction?: any) {
        this.transactionId = transaction && transaction.transactionId;
        this.accountId = transaction && transaction.accountId;
        this.userId = transaction && transaction.userId;
        this.name = transaction && transaction.name;
        this.description = transaction && transaction.description;
        this.amount = transaction && transaction.amount;
        this.date = transaction && transaction.date;
    }

    transactionId: string;
    accountId: string;
    userId: string;
    name: string;
    description: string;
    amount: number;
    date: Date;

    isValid(): boolean {
        return !!(this.accountId && this.userId && this.name && this.amount && this.date);
    }
};
