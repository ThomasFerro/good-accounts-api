import { Router, Response } from 'express';
import { GoodAccountsRequest } from '../utils/Request';
import { transactionService } from '../api';
import { Transaction } from '../../../domain/transaction/core/entities/Transaction/Transaction';

const router: Router = Router();

router.post('/', (req: GoodAccountsRequest, res: Response) => {
    // TODO : req.body in Transaction constructor
    res.send(transactionService.addTransactionToAccount(req.params.accountId, new Transaction(), req.user && req.user.userId));
});

export const TransactionsController: Router = router;