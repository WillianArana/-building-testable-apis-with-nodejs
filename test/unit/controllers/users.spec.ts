import { UsersController } from './../../../src/controllers/users';
import User, { IUser } from './../../../src/models/users';

describe('Controllers: Users', () => {
  const defaultUser = {
    name: 'Default User',
    email: 'default@example.com',
    password: 'password',
    role: 'user',
  } as unknown as IUser;
  const defaultUsers = [defaultUser];

  const defaultRequest: any = {
    params: {},
  };

  let usersController: UsersController;
  beforeEach(() => {
    usersController = new UsersController();
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('get() users', () => {
    it('should return a list of users', async () => {
      const findSpy = jest.spyOn(User, 'find').mockReturnValue(defaultUsers as any);
      const response: any = { send: jest.fn() };
      const spy = jest.spyOn(response, 'send');

      await usersController.get(defaultRequest, response);

      expect(findSpy).toHaveBeenLastCalledWith({});
      findSpy.mockRestore();

      expect(spy).toHaveBeenCalled();
      expect(response.send).toHaveBeenCalledWith(defaultUsers);
      spy.mockRestore();
    });

    it('should return 400 when an error occurs', async () => {
      const findSpy = jest.spyOn(User, 'find').mockRejectedValue({ message: 'Error' });
      const response: any = { send: jest.fn(), status: (code: number) => ({ send: jest.fn() }) };
      const spy = jest.spyOn(response, 'status');

      await usersController.get(defaultRequest, response);

      expect(findSpy).toHaveBeenLastCalledWith({});
      findSpy.mockRestore();

      expect(spy).toHaveBeenLastCalledWith(400);
      spy.mockRestore();
    });
  });

  describe('getById() user', () => {
    it('should return one user', async () => {
      const findSpy = jest.spyOn(User, 'findOne').mockReturnValue(defaultUser as any);
      const response: any = { send: jest.fn(), status: jest.fn() };
      const spy = jest.spyOn(response, 'send');
      const fakeId = 'a-fake-id';
      const request: any = {
        params: { id: fakeId },
      };
      await usersController.getById(request, response);

      expect(findSpy).toHaveBeenLastCalledWith({ _id: fakeId });
      findSpy.mockRestore();

      expect(spy).toHaveBeenLastCalledWith(defaultUser);
      spy.mockRestore();
    });

    it('should return 400 when an error occurs', async () => {
      const findSpy = jest.spyOn(User, 'findOne').mockRejectedValue({ message: 'Error' });
      const response: any = { send: jest.fn(), status: (code: number) => ({ send: jest.fn() }) };
      const spy = jest.spyOn(response, 'status');
      const fakeId = 'a-fake-id';
      const request: any = {
        params: { id: fakeId },
      };

      await usersController.getById(request, response);

      expect(findSpy).toHaveBeenLastCalledWith({ _id: fakeId });
      findSpy.mockRestore();

      expect(spy).toHaveBeenLastCalledWith(400);
      spy.mockRestore();
    });
  });

  describe('create() user', () => {
    it('should save a new user successfully', async () => {
      const findSpy = jest.spyOn(User, 'create').mockReturnValue(defaultUser as any);
      const response: any = { send: jest.fn(), status: jest.fn() };
      const spy = jest.spyOn(response, 'send');
      const request: any = {
        body: defaultUser,
      };

      await usersController.create(request, response);

      expect(findSpy).toHaveBeenLastCalledWith(defaultUser);
      findSpy.mockRestore();

      expect(spy).toHaveBeenLastCalledWith(defaultUser);
      spy.mockRestore();
    });

    it('should return 422 when an error occurs', async () => {
      const findSpy = jest.spyOn(User, 'create').mockRejectedValue({ message: 'Error' } as never);
      const response: any = { send: jest.fn(), status: (code: number) => ({ send: jest.fn() }) };
      const spy = jest.spyOn(response, 'status');
      const request: any = {
        body: defaultUser,
      };

      await usersController.create(request, response);

      expect(findSpy).toHaveBeenLastCalledWith(defaultUser);
      findSpy.mockRestore();

      expect(spy).toHaveBeenLastCalledWith(422);
      spy.mockRestore();
    });
  });

  describe('update() user', () => {
    it('should respond with 200 when the user has been updated', async () => {
      const fakeId = 'a-fake-id';
      const updatedProduct = {
        _id: fakeId,
        name: 'Updated user',
        password: 'new password',
      } as unknown as IUser;
      const request: any = {
        params: {
          id: fakeId,
        },
        body: updatedProduct,
      };

      const user: any = { ...updatedProduct, save: jest.fn() };

      const saveSpy = jest.spyOn(user, 'save');

      const findSpy = jest.spyOn(User, 'findOne').mockReturnValue(user);
      const response: any = { status: (code: number) => ({ send: jest.fn() }) };
      const spy = jest.spyOn(response, 'status');

      await usersController.update(request, response);

      expect(findSpy).toHaveBeenLastCalledWith({ _id: fakeId });
      findSpy.mockRestore();

      expect(saveSpy).toBeCalled();
      saveSpy.mockRestore();

      expect(spy).toHaveBeenLastCalledWith(200);
      spy.mockRestore();
    });

    it('should respond with 200 when the user without password has been updated', async () => {
      const fakeId = 'a-fake-id';
      const updatedUser = {
        _id: fakeId,
        name: 'Updated user',
        password: 'new password',
      } as unknown as IUser;
      const request: any = {
        params: {
          id: fakeId,
        },
        body: {
          _id: fakeId,
          name: 'Updated user',
        } as unknown as IUser,
      };

      const user: any = { ...updatedUser, save: jest.fn() };

      const saveSpy = jest.spyOn(user, 'save');

      const findSpy = jest.spyOn(User, 'findOne').mockReturnValue(user);
      const response: any = { status: (code: number) => ({ send: jest.fn() }) };
      const spy = jest.spyOn(response, 'status');

      await usersController.update(request, response);

      expect(findSpy).toHaveBeenLastCalledWith({ _id: fakeId });
      findSpy.mockRestore();

      expect(saveSpy).toBeCalled();
      saveSpy.mockRestore();

      expect(spy).toHaveBeenLastCalledWith(200);
      spy.mockRestore();
    });

    it('should respond with 200 when the not found user has been updated', async () => {
      const fakeId = 'a-fake-id';
      const updatedProduct = {
        _id: fakeId,
        name: 'Updated user',
        password: 'new password',
      } as unknown as IUser;
      const request: any = {
        params: {
          id: fakeId,
        },
        body: updatedProduct,
      };

      const findSpy = jest.spyOn(User, 'findOne').mockReturnValue(null as any);
      const response: any = { status: (code: number) => ({ send: jest.fn() }) };
      const spy = jest.spyOn(response, 'status');

      await usersController.update(request, response);

      expect(findSpy).toHaveBeenLastCalledWith({ _id: fakeId });
      findSpy.mockRestore();

      expect(spy).toHaveBeenLastCalledWith(200);
      spy.mockRestore();
    });

    it('should return 422 when an error occurs', async () => {
      const fakeId = 'a-fake-id';
      const updatedProduct = {
        _id: fakeId,
        name: 'Updated user',
        password: 'new password',
      } as unknown as IUser;
      const request: any = {
        params: {
          id: fakeId,
        },
        body: updatedProduct,
      };
      jest.spyOn(User, 'findOne').mockRejectedValue({ message: 'Error' });

      const response: any = { status: (code: number) => ({ send: jest.fn() }) };
      const spy = jest.spyOn(response, 'status');

      await usersController.update(request, response);

      expect(spy).toHaveBeenLastCalledWith(422);
      spy.mockRestore();
    });
  });

  describe('delete() user', () => {
    it('should respond with 204 when the user has been deleted', async () => {
      const fakeId = 'a-fake-id';
      const findSpy = jest.spyOn(User, 'deleteOne').mockReturnValue({} as any);
      const response: any = { status: (code: number) => ({ send: jest.fn() }) };
      const spy = jest.spyOn(response, 'status');
      const request: any = {
        params: {
          id: fakeId,
        },
      };

      await usersController.remove(request, response);

      expect(findSpy).toHaveBeenLastCalledWith({ _id: fakeId });
      findSpy.mockRestore();

      expect(spy).toHaveBeenLastCalledWith(204);
      spy.mockRestore();
    });

    it('should return 400 when an error occurs', async () => {
      const fakeId = 'a-fake-id';
      const request: any = {
        params: {
          id: fakeId,
        },
      };
      jest.spyOn(User, 'deleteOne').mockRejectedValue({ message: 'Error' });

      const response: any = { status: (code: number) => ({ send: jest.fn() }) };
      const spy = jest.spyOn(response, 'status');

      await usersController.remove(request, response);

      expect(spy).toHaveBeenLastCalledWith(400);
      spy.mockRestore();
    });
  });

  describe('authenticate', () => {
    it('should authenticate the user', async () => {
      const password = '123password';
      const hashedPassword = 'E8n9@O1u$p4yiE36Ex5KNuGv#@!6E2sjNsS5rEACmC';
      const user: any = {
        name: 'Jhon Doe 02',
        email: 'jhon02@mail.com',
        password: hashedPassword,
      };
      const tokenExpected = 'm1Mf8X%Yi7&1ipYKnxi6Y$&5ZOHHA26NHqpnpDZ3%Q';

      const spyAuthenticate = jest
        .spyOn(usersController.authService, 'authenticate')
        .mockReturnValue(Promise.resolve(user));
      const spyGenerateToken = jest
        .spyOn(usersController.authService, 'generateToken')
        .mockReturnValue(tokenExpected);

      const response: any = { status: jest.fn(), send: jest.fn() };
      const spyStatus = jest.spyOn(response, 'status');
      const spySend = jest.spyOn(response, 'send');

      const request: any = {
        body: {
          email: 'jhon02@mail.com',
          password,
        },
      };

      await usersController.authenticate(request, response);

      expect(spyAuthenticate).toHaveBeenLastCalledWith(request.body);
      spyAuthenticate.mockRestore();

      expect(spyGenerateToken).toHaveBeenLastCalledWith(user);
      spyGenerateToken.mockRestore();

      expect(spyStatus).toHaveBeenLastCalledWith(200);
      spyStatus.mockRestore();

      expect(spySend).toHaveBeenLastCalledWith({ token: tokenExpected });
      spySend.mockRestore();
    });

    it('should return 500 when an error occurs', async () => {
      const request: any = {
        body: {},
      };
      jest
        .spyOn(usersController.authService, 'authenticate')
        .mockRejectedValue({ message: 'Error' });

      const response: any = { status: (code: number) => ({ send: jest.fn() }) };
      const spy = jest.spyOn(response, 'status');

      await usersController.authenticate(request, response);

      expect(spy).toHaveBeenLastCalledWith(500);
      spy.mockRestore();
    });

    it('should return 401 when user unauthorized or not found', async () => {
      const request: any = {
        body: {
          name: 'Jhon Doe 02',
          email: 'jhon02@mail.com',
          password: '123456',
        },
      };
      const spyAuthenticate = jest
        .spyOn(usersController.authService, 'authenticate')
        .mockReturnValue(Promise.resolve(null));

      const response: any = { status: (code: number) => ({ send: jest.fn() }) };
      const spyStatus = jest.spyOn(response, 'status');

      await usersController.authenticate(request, response);

      expect(spyStatus).toHaveBeenLastCalledWith(401);
      spyStatus.mockRestore();

      expect(spyAuthenticate).toHaveBeenLastCalledWith(request.body);
      spyAuthenticate.mockRestore();
    });
  });
});
