export class Transaction {
    // TODO : Transaction constructor with any object as parameter

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
