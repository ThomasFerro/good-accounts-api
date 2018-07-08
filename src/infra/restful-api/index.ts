import * as express from 'express';
import * as helmet from 'helmet';
import * as bodyParser from 'body-parser';

import { Routes } from './controllers';
import { authorizationMiddleware, errorMiddleware } from './middlewares';

const app: express.Application = express();
const port: number = Number(process.env.PORT) || 3000;

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Authorization middleware
app.use(authorizationMiddleware);

// Register the API routes
app.use('/api/v1', Routes);

// Error middleware
app.use(errorMiddleware);

app.listen(port, () => {
    console.log('Example app listening on port 3000!')
});
