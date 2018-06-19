import { Router } from 'express';
import { AccountsController } from './AccountsController';
import { TransactionsController } from './TransactionsController';
import { UsersController } from './UsersController';

const router: Router = Router();

router.use('/accounts', AccountsController);
router.use('/accounts/:accountId/transactions', TransactionsController);
router.use('/users', UsersController);

export const Routes: Router = router;