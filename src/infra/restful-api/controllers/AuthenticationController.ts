import { Router, Response, NextFunction } from "express";

import { GoodAccountsRequest } from "../utils/Request";
import { GoodAccountsError } from "../utils/Error";

import { authenticationService } from '../api';

const router: Router = Router();

router.post('/', (req: GoodAccountsRequest, res: Response, next: NextFunction) => {
    authenticationService.generateToken(
        req.body && req.body.username,
        req.body && req.body.password
    )
        .then((jwt) => {
            res.send(jwt);
        })
        .catch((error) => {
            next(new GoodAccountsError({
                error: 'Authentication failed',
                message: error
            }));
        })
});

export const AuthenticationController: Router = router;