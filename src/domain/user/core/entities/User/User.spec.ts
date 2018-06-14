import { User } from './User';

describe('User entity', () => {
    describe('validity', () => {
        let user: User;
        
        beforeEach(() => {
            user = new User();
            user.email = 'USER_EMAIL';
            user.login = 'USER_LOGIN';
            user.name = 'USER_NAME';
        });

        test('should be invalid when providing no email', () => {
            user.email = '';
            expect(user.isValid()).toBeFalsy();
        });

        test('should be invalid when providing no login', () => {
            user.login = '';
            expect(user.isValid()).toBeFalsy();
        });

        test('should be invalid when providing no name', () => {
            user.name = '';
            expect(user.isValid()).toBeFalsy();
        });
        
        test('should be valid when providing all mandatory informations', () => {
            expect(user.isValid()).toBeTruthy();
        });
    });
});
