/* eslint-disable func-names */
import { hash } from 'bcrypt';
import { Document, model, Schema } from 'mongoose';

export type Roles = 'admin' | 'user';
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Roles;
}

const schema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

schema.set('toJSON', {
  transform: (doc, ret) => ({
    _id: ret._id,
    email: ret.email,
    name: ret.name,
    role: ret.role,
  }),
});

schema.pre<IUser>('save', async function (next): Promise<void> {
  if (!this.password || !this.isModified('password')) {
    next();
  }

  try {
    const hashedPassword = await hash(this.password, 10);
    this.password = hashedPassword;
  } catch (error) {
    next(error as Error);
  }
});

export default model<IUser>('User', schema);
