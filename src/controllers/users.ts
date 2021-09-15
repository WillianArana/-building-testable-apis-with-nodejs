import { Request, Response } from 'express';

import User, { IUser } from '../models/users';
import { AuthService } from '../services/auth.service';

export class UsersController {
  private readonly _user = User;
  public readonly authService = new AuthService();

  public async get(request: Request, response: Response): Promise<void> {
    try {
      const users = await this._user.find({});
      response.send(users);
    } catch (error) {
      response.status(400).send((error as Error).message);
    }
  }

  public async getById(request: Request, response: Response): Promise<void> {
    try {
      const {
        params: { id },
      } = request;
      const user = await this._user.findOne({ _id: id });
      response.send(user);
    } catch (error) {
      response.status(400).send((error as Error).message);
    }
  }

  public async create(request: Request, response: Response): Promise<void> {
    try {
      const user = await this._user.create(request.body);
      response.status(201);
      response.send(user);
    } catch (error) {
      response.status(422).send((error as Error).message);
    }
  }

  public async update(request: Request, response: Response): Promise<void> {
    try {
      const {
        body,
        params: { id },
      } = request;

      const user = await this._user.findOne({ _id: id });
      if (user) {
        user.name = body.name;
        user.email = body.email;
        user.role = body.role;

        if (body.password) {
          user.password = body.password;
        }

        await user.save();
      }
      response.status(200).send();
    } catch (error) {
      response.status(422).send((error as Error).message);
    }
  }

  public async remove(request: Request, response: Response): Promise<void> {
    try {
      const {
        params: { id },
      } = request;
      await this._user.deleteOne({ _id: id });
      response.status(204).send();
    } catch (error) {
      response.status(400).send((error as Error).message);
    }
  }

  public async authenticate(request: Request, response: Response): Promise<void> {
    try {
      const user = await this.authService.authenticate(request.body as IUser);
      if (user) {
        const token = this.authService.generateToken(user);
        response.status(200);
        response.send({ token });
        return;
      }

      response.status(401).send('User unauthorized');
    } catch (error) {
      response.status(500).send((error as Error).message);
    }
  }
}
