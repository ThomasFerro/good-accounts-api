import { Router, Request, Response } from 'express';
import { transactionService } from '../api';
import { Transaction } from '../../../domain/transaction/core/entities/Transaction/Transaction';

const router: Router = Router();

router.post('/', (req: Request, res: Response) => {
    res.send(transactionService.addTransactionToAccount(req.params.accountId, new Transaction(), 'TODO_USER_ID'));
});

export const TransactionsController: Router = router;