import { Router, Response } from 'express';
import { GoodAccountsRequest } from '../utils/Request';
import { transactionService } from '../api';
import { Transaction } from '../../../domain/transaction/core/entities/Transaction/Transaction';

const router: Router = Router({mergeParams: true});

router.post('/', (req: GoodAccountsRequest, res: Response) => {
    res.send(transactionService.addTransactionToAccount(req.params.accountId, new Transaction(req.body), req.user && req.user.userId));
});

export const TransactionsController: Router = router;