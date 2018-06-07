import { IAccountRepository } from '.././IAccountRepository';

export class AccountRepositoryMock implements IAccountRepository {
    findUserAccounts = jest.fn((user) => {
        return [];
    });
};
