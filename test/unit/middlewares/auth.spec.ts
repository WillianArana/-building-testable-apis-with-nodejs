import { sign } from 'jsonwebtoken';

import authMiddleware from '../../../src/middlewares/auth';

describe('AuthMiddleware', () => {
  it('should verify a JWT token and call the next middleware', (done) => {
    const key = 'm1EAj93v2FE4pHLpIbwJegEZ7bT';
    const jwtToken = sign({ data: 'fake' }, key, { expiresIn: '7d' });

    const reqFake: any = {
      headers: {
        authorization: `Bearer ${jwtToken}`,
        decoded: undefined,
      },
    };
    const resFake = {};
    authMiddleware(reqFake, resFake, done);
  });

  it('should call the next middleware passing an error when the token validation fails', (done) => {
    const reqFake: any = {
      headers: {
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ8.eyJkYXRhIjoiZmFrZSIsImlhdCI6MTYzMDg5OTU2NCwiZXhwIjoxNjMxNTA0MzY0fQ.0Bw-KRyRxw8UWeD80C9jlZrxeZSSbI_hyYBmWxXS4cE',
        decoded: undefined,
      },
    };
    const resFake = {};
    authMiddleware(reqFake, resFake, (error: any) => {
      expect(error.message).toEqual('invalid token');
      done();
    });
  });

  it('should call next middleware if theres no token', () => {
    const reqFake: any = {
      headers: {},
    };
    const resFake = {};
    authMiddleware(reqFake, resFake, jest.fn);
  });
});
