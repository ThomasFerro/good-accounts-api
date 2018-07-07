import { Router } from 'express';
import { AccountsController } from './AccountsController';
import { TransactionsController } from './TransactionsController';
import { UsersController } from './UsersController';
import { AuthenticationController } from './AuthenticationController';

import { authorizationRequired } from '../middlewares/AuthorizationMiddleware';

const router: Router = Router();

router.use('/login', AuthenticationController)

router.use('/accounts', authorizationRequired, AccountsController);
router.use('/accounts/:accountId/transactions', authorizationRequired, TransactionsController);
router.use('/users', authorizationRequired, UsersController);

export const Routes: Router = router;