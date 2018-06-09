export class Transaction {
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
