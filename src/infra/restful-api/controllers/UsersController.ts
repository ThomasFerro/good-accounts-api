import { Router, Request, Response } from 'express';
import { userService } from '../api';
import { User } from '../../../domain/user/core/entities/User/User';

const router: Router = Router();

router.post('/', (req: Request, res: Response) => {
    res.send(userService.createUser(new User()));
});

export const UsersController: Router = router;