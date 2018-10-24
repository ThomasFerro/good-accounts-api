import { Router, Response, NextFunction } from 'express';
import { GoodAccountsRequest } from '../utils/Request';
import { GoodAccountsError } from "../utils/Error";
import { accountService } from '../api';
import { Account } from '../../../domain/account/core/entities/Account/Account';

const router: Router = Router();

router.get('/', async (req: GoodAccountsRequest, res: Response, next: NextFunction) => {
    try {
        res.send(await accountService.getAllUserAccounts(req.user && req.user.userId));
    } catch (e) {
        next(new GoodAccountsError({
            error: 'User accounts fetching error',
            message: e && e.message
        }));
    }
});

router.post('/', async (req: GoodAccountsRequest, res: Response, next: NextFunction) => {
    try {
        res.send(await accountService.createAccount(new Account(req.body), req.user && req.user.userId));
    } catch (e) {
        next(new GoodAccountsError({
            error: 'Accounts creation error',
            message: e && e.message
        }));
    }
});

router.get('/:accountId', async (req: GoodAccountsRequest, res: Response, next: NextFunction) => {
    try {
        res.send(await accountService.getAccount(req.params.accountId, req.user && req.user.userId));
    } catch (e) {
        next(new GoodAccountsError({
            error: 'Account fetching error',
            message: e && e.message
        }));
    }
});

router.put('/:accountId', async (req: GoodAccountsRequest, res: Response, next: NextFunction) => {
    try {
        res.send(await accountService.modifyAccount(new Account(req.body), req.user && req.user.userId));
    } catch (e) {
        next(new GoodAccountsError({
            error: 'Account modification error',
            message: e && e.message
        }));
    }
});

router.delete('/:accountId', async (req: GoodAccountsRequest, res: Response, next: NextFunction) => {
    try {
        res.send(await accountService.removeAccount(req.params.accountId, req.user && req.user.userId));
    } catch (e) {
        next(new GoodAccountsError({
            error: 'Account suppression error',
            message: e && e.message
        }));
    }
});

export const AccountsController: Router = router;