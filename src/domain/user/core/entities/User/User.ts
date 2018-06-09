export class User {
    userId: string;

    isValid(): boolean {
        return !!this.userId;
    }
};
