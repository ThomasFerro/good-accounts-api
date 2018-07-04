export class User {
    constructor(user?: any) {
        this.userId = user && user.userId;
        this.login = user && user.login;
        this.name = user && user.name;
        this.email = user && user.email;
        this.password = user && user.password;
        this.passwordSalt = user && user.passwordSalt;
        this.passwordHashAlgorithm = user && user.passwordHashAlgorithm;
    }

    userId: string;
    login: string;
    name: string;
    email: string;
    password: string;
    passwordSalt: string;
    passwordHashAlgorithm: string;

    isValid(): boolean {
        return !!(this.login && this.name && this.email);
    };

    userInfo(): any {
        return {
            userId: this.userId,
            login: this.login,
            name: this.name,
            email: this.email,
        };
    };
};
