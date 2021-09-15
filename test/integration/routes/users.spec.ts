import defaultRequest from '../global';
import User, { IUser } from './../../../src/models/users';
import { AuthService } from './../../../src/services/auth.service';

describe('Routes: Users', () => {
  const defaultAdmin = {
    name: 'Jhon Doe',
    email: 'jhon@mail.com',
    password: '123password',
    role: 'admin',
  } as IUser;

  const expectedAdmin = {
    __v: 0,
    _id: '',
    ...defaultAdmin,
  };

  let request: any;
  let authToken: any;
  beforeAll(async () => {
    request = await defaultRequest();
    const authService = new AuthService();
    const token = authService.generateToken(defaultAdmin);
    authToken = { Authorization: `Bearer ${token}` };
  });

  beforeEach(async () => {
    await User.deleteMany();
    const admin = new User(defaultAdmin);
    expectedAdmin._id = admin._id.toString();
    await admin.save();
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  describe('GET /users', () => {
    describe('when getting users', () => {
      it('should return a list of users with status 200', async () => {
        const res = await request.get('/users').set(authToken);
        expect(res.statusCode).toEqual(200);
        const users = res.body;
        expect(users[0].name).toEqual(expectedAdmin.name);
        expect(users[0].email).toEqual(expectedAdmin.email);
        expect(users[0].password).toBeUndefined();
        expect(users[0].role).toEqual(expectedAdmin.role);
        expect(users[0]._id).toEqual(expectedAdmin._id);
      });
    });

    describe('when an id is specified', () => {
      it('should return one user with status 200', async () => {
        const id = expectedAdmin._id;
        const res = await request.get(`/users/${id}`).set(authToken);
        expect(res.statusCode).toEqual(200);
        const user = res.body;
        expect(user.name).toEqual(expectedAdmin.name);
        expect(user.email).toEqual(expectedAdmin.email);
        expect(user.password).toBeUndefined();
        expect(user.role).toEqual(expectedAdmin.role);
        expect(user._id).toEqual(expectedAdmin._id);
      });
    });
  });

  describe('POST /users', () => {
    describe('when posting a user', () => {
      it('should return a new user with status 201', async () => {
        const newUser = {
          name: 'Jhon Doe 02',
          email: 'jhon02@mail.com',
          password: '123password',
          role: 'user',
        };
        const res = await request.post(`/users`).set(authToken).send(newUser);
        expect(res.statusCode).toEqual(201);
        const expectedSavedUser = res.body;
        expect(expectedSavedUser.name).toEqual(newUser.name);
        expect(expectedSavedUser.email).toEqual(newUser.email);
        expect(expectedSavedUser.password).toBeUndefined();
        expect(expectedSavedUser.role).toEqual(newUser.role);
        expect(expectedSavedUser._id).toMatch(/^[a-fA-F0-9]{24}$/);
      });
    });
  });

  describe('PUT /users/:id', () => {
    describe('when editing a user', () => {
      it('should update the user and return 200 as status code', async () => {
        const customUser = {
          email: 'jhondoe@mail.com',
        };
        const updateUser = Object.assign({}, customUser, defaultAdmin);
        const id = expectedAdmin._id;
        const res = await request.put(`/users/${id}`).set(authToken).send(updateUser);
        expect(res.statusCode).toEqual(200);
      });
    });
  });

  describe('DELETE /users/:id', () => {
    describe('when deleting a user', () => {
      it('should delete a user and return 204 as status code', async () => {
        const id = expectedAdmin._id;
        const res = await request.delete(`/users/${id}`).set(authToken);
        expect(res.statusCode).toEqual(204);
      });
    });
  });

  describe('POST /users/authenticate', () => {
    describe('when authenticating an use', () => {
      it('should generate a valid token', async () => {
        const user = {
          email: 'jhon@mail.com',
          password: '123password',
        };

        const res = await request.post(`/users/authenticate`).send(user);
        expect(res.body).toHaveProperty('token');
        expect(res.statusCode).toEqual(200);
      });

      it('should return unauthorized when the password does not match', async () => {
        const user = {
          email: 'jhon02@mail.com',
          password: 'password123',
          role: 'user',
        };
        const res = await request.post(`/users/authenticate`).send(user);
        expect(res.statusCode).toEqual(401);
      });
    });
  });
});
