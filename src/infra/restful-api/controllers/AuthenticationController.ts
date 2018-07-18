import { Router, Response, NextFunction } from "express";

import { GoodAccountsRequest } from "../utils/Request";
import { GoodAccountsError } from "../utils/Error";

import { authenticationService } from '../api';

const router: Router = Router();

router.post('/', async (req: GoodAccountsRequest, res: Response, next: NextFunction) => {
    try {
        res.send(await authenticationService.generateToken(
            req.body && req.body.username,
            req.body && req.body.password
        ));
    } catch (e) {
        next(new GoodAccountsError({
            error: 'Authentication failed',
            message: e
        }));
    }
});

export const AuthenticationController: Router = router;