export class GoodAccountsError {
    constructor(error: any) {
        this.errorCode = error && error.errorCode;
        this.error = error && error.error;
        this.message = error && error.message;    
    }
    
    errorCode: number;
    error: any;
    message: string;
};