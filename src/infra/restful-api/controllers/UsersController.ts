import { Router, Response, NextFunction } from 'express';
import { GoodAccountsRequest } from '../utils/Request';
import { GoodAccountsError } from "../utils/Error";
import { userService } from '../api';
import { User } from '../../../domain/user/core/entities/User/User';

const router: Router = Router();

router.post('/', async (req: GoodAccountsRequest, res: Response, next: NextFunction) => {
    try {
        const user = await userService.createUser(new User(req.body)); 
        res.send(user);
    } catch (e) {
        next(new GoodAccountsError({
            error: 'User creation failed',
            message: e
        }));
    }
});

export const UsersController: Router = router;