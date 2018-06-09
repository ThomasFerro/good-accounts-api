import { Account } from './Account';

describe('Account entity', () => {
    describe('validity', () => {
        let account: Account;
        
        beforeEach(() => {
            account = new Account();
        });
        
        test('should be valid when providing an account name', () => {
            account.name = 'ACCOUNT_NAME';
            expect(account.isValid()).toBeTruthy();
        });

        test('should be invalid when providing no name', () => {            
            expect(account.isValid()).toBeFalsy();
        });
    });
});
