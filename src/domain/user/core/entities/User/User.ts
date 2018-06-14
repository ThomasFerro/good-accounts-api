export class User {
    userId: string;
    login: string;
    name: string;
    email: string;
    password: string;
    passwordSalt: string;
    passwordHashAlgorithm: string;

    isValid(): boolean {
        return !!(this.login && this.name && this.email);
    }
};
