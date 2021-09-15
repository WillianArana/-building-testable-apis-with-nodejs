import { config } from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { setUri } from '../src/database';

config({ path: './.env' });
export const makeGlobalDatabase = async () => {
  const mongod = await MongoMemoryServer.create();
  setUri(mongod.getUri());
  return mongod;
};
