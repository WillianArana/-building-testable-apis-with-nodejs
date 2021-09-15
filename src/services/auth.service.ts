import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import User, { IUser } from '../models/users';

export class AuthService {
  private readonly _user = User;
  private readonly _key = process.env.AUTH_KEY ?? 'm1EAj93v2FE4pHLpIbwJegEZ7bT';
  private readonly _expiresIn = process.env.AUTH_TOKEN_Expires_In ?? '7d';

  async authenticate(data: IUser): Promise<IUser | null> {
    const user = await this._user.findOne({ email: data.email });
    if (!user || !(await compare(data.password, user.password))) {
      return null;
    }
    return user;
  }

  generateToken(data: IUser): string {
    const key = this._key;
    const expiresIn = this._expiresIn;
    return sign(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      },
      key,
      {
        expiresIn,
      }
    );
  }
}
