import { Router, Response } from 'express';
import { GoodAccountsRequest } from '../utils/Request';
import { userService } from '../api';
import { User } from '../../../domain/user/core/entities/User/User';

const router: Router = Router();

router.post('/', (req: GoodAccountsRequest, res: Response) => {
    // TODO : Check if the user has password, hash it and create the right user
    res.send(userService.createUser(new User(req.body)));
});

export const UsersController: Router = router;