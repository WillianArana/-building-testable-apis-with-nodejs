import { makeGlobalDatabase } from '../database';
import * as superTest from 'supertest';
import setupApp from '../../src/app';

export default async () => {
  await makeGlobalDatabase();
  const app = await setupApp();
  const request = superTest(app);
  return request;
};
