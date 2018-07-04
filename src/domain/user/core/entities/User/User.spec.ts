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

        it('should be invalid when providing no email', () => {
            user.email = '';
            expect(user.isValid()).toBeFalsy();
        });

        it('should be invalid when providing no login', () => {
            user.login = '';
            expect(user.isValid()).toBeFalsy();
        });

        it('should be invalid when providing no name', () => {
            user.name = '';
            expect(user.isValid()).toBeFalsy();
        });
        
        it('should be valid when providing all mandatory informations', () => {
            expect(user.isValid()).toBeTruthy();
        });
    });

    describe('userInfo', () => {
        let user: User;
        let userInfo: User;

        beforeEach(() => {
            user = new User({
                userId: 'USER_ID',
                login: 'LOGIN',
                name: 'NAME',
                email: 'EMAIL',
                password: 'PASSWORD',
                passwordSalt: 'PASSWORD_SALT',
                passwordHashAlgorithm: 'PASSWORD_HASH_ALGORITHM'
            });

            userInfo = user.userInfo();
        });

        it('should return the user\'s id', () => {
            expect(userInfo && userInfo.userId).toBe(user.userId);
        });

        it('should return the user\'s login', () => {
            expect(userInfo && userInfo.login).toBe(user.login);
        });

        it('should return the user\'s name', () => {
            expect(userInfo && userInfo.name).toBe(user.name);
        });

        it('should return the user\'s email', () => {
            expect(userInfo && userInfo.email).toBe(user.email);
        });

        it('should not return the user\'s password', () => {
            expect(userInfo && userInfo.password).toBeFalsy();
        });

        it('should not return the user\'s password salt', () => {
            expect(userInfo && userInfo.passwordSalt).toBeFalsy();
        });

        it('should not return the user\'s id', () => {
            expect(userInfo && userInfo.passwordHashAlgorithm).toBeFalsy();
        });
    });
});
