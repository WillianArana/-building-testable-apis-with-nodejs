import { hash } from 'bcrypt';

import User, { IUser } from './../../../src/models/users';
import { AuthService } from './../../../src/services/auth.service';

import { sign } from 'jsonwebtoken';

describe('Service: Auth', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  describe('authenticate', () => {
    it('should authenticate an user', async () => {
      const user = {
        name: 'Jhon Doe',
        email: 'jhondoe@mail.com',
        password: '123456',
        role: 'user',
      } as IUser;

      const hashedPassword = await hash(user.password, 10);

      const userFromDatabase: any = Object.assign({}, user, {
        password: hashedPassword,
      });

      const findSpy = jest.spyOn(User, 'findOne').mockReturnValue(userFromDatabase);

      const res = await authService.authenticate(user);

      expect(res).toEqual(userFromDatabase);
      expect(findSpy).toHaveBeenLastCalledWith({ email: 'jhondoe@mail.com' });
      findSpy.mockRestore();
    });

    it('should return false when the password does not match', async () => {
      const user = {
        name: 'Jhon Doe',
        email: 'jhondoe@mail.com',
        password: '123456',
        role: 'user',
      } as IUser;

      const userFromDatabase: any = Object.assign({}, user, {
        password: 'aFakeHashedPass',
      });

      jest.spyOn(User, 'findOne').mockReturnValue(userFromDatabase);

      const res = await authService.authenticate(user);
      expect(res).toBeNull();
    });
  });

  describe('generateToken', () => {
    it('should generate a JWT token from a payload', () => {
      const payload = {
        name: 'John Doe',
        email: 'jhondoe@mail.com',
        password: '12345',
        role: 'admin',
      } as IUser;

      const key = process.env.AUTH_KEY ?? 'm1EAj93v2FE4pHLpIbwJegEZ7bT';
      const expiresIn = process.env.AUTH_TOKEN_Expires_In ?? '7d';
      const expectedToken = sign(
        {
          name: payload.name,
          email: payload.email,
          password: payload.password,
          role: payload.role,
        },
        key,
        {
          expiresIn,
        }
      );

      const generatedToken = authService.generateToken(payload);
      expect(generatedToken).toEqual(expectedToken);
    });
  });
});
