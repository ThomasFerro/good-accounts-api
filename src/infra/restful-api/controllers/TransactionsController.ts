import { Router, Response, NextFunction } from 'express';
import { GoodAccountsRequest } from '../utils/Request';
import { GoodAccountsError } from '../utils/Error';
import { transactionService } from '../api';
import { Transaction } from '../../../domain/transaction/core/entities/Transaction/Transaction';

const router: Router = Router({mergeParams: true});

router.post('/', async (req: GoodAccountsRequest, res: Response, next: NextFunction) => {
    try {
        res.send(await transactionService.addTransactionToAccount(req.params.accountId, new Transaction(req.body), req.user && req.user.userId));
    } catch (e) {
        next(new GoodAccountsError({
            error: 'Transaction creation error',
            message: e && e.message
        }));
    }
});

router.delete('/:transactionId', async (req: GoodAccountsRequest, res: Response, next: NextFunction) => {
    try {
        res.send(
            await transactionService.removeTransactionFromAccount(
                req.params.accountId, req.params.transactionId, req.user && req.user.userId
            )
        );
    } catch (e) {
        next(new GoodAccountsError({
            error: 'Transaction suppression error',
            message: e && e.message
        }));
    }
});

export const TransactionsController: Router = router;