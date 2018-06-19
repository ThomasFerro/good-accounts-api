import { Router, Request, Response } from 'express';
import { accountService } from '../api';
import { Account } from '../../../domain/account/core/entities/Account/Account';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send(accountService.getAllUserAccounts('TODO_USER_ID'));
});

router.post('/', (req: Request, res: Response) => {
    res.send(accountService.createAccount(new Account(), 'TODO_USER_ID'));
});

router.get('/:accountId', (req: Request, res: Response) => {
    res.send(accountService.getAccount(req.params.accountId, 'TODO_USER_ID'));
});

router.put('/:accountId', (req: Request, res: Response) => {
    res.send(accountService.modifyAccount(new Account(), 'TODO_USER_ID'));
});

router.delete('/:accountId', (req: Request, res: Response) => {
    res.send(accountService.removeAccount(req.params.accountId, 'TODO_USER_ID'));
});

export const AccountsController: Router = router;