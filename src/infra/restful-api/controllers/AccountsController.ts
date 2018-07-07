import { Router, Response } from 'express';
import { GoodAccountsRequest } from '../utils/Request';
import { accountService } from '../api';
import { Account } from '../../../domain/account/core/entities/Account/Account';

const router: Router = Router();

router.get('/', (req: GoodAccountsRequest, res: Response) => {
    res.send(accountService.getAllUserAccounts(req.user && req.user.userId));
});

router.post('/', (req: GoodAccountsRequest, res: Response) => {
    // TODO : req.body in Account constructor
    res.send(accountService.createAccount(new Account(), req.user && req.user.userId));
});

router.get('/:accountId', (req: GoodAccountsRequest, res: Response) => {
    res.send(accountService.getAccount(req.params.accountId, req.user && req.user.userId));
});

router.put('/:accountId', (req: GoodAccountsRequest, res: Response) => {
    // TODO : req.body in Account constructor
    res.send(accountService.modifyAccount(new Account(), req.user && req.user.userId));
});

router.delete('/:accountId', (req: GoodAccountsRequest, res: Response) => {
    res.send(accountService.removeAccount(req.params.accountId, req.user && req.user.userId));
});

export const AccountsController: Router = router;