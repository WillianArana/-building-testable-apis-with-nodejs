import * as express from 'express';
import { authorize, config } from 'express-acl';
import * as helmet from 'helmet';

import database from './database';
import authMiddleware from './middlewares/auth';
import router from './routes';

type Application = express.Application;

config({ baseUrl: '/', path: 'config' });
const configureExpress = (): Application => {
  const app = express();
  app.use(helmet());
  app.use(authMiddleware);
  app.use(authorize.unless({ path: ['/users/authenticate'] }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/', router);
  app.set('database', database);
  return app;
};

export default async (): Promise<Application> => {
  const app = configureExpress();
  await app.get('database').connect();
  return app;
};
