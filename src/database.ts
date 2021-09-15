import { connect, ConnectOptions } from 'mongoose';
import { config } from 'dotenv';

config({ path: './.env' });
let mongodbUri = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}?authSource=admin`;

export function setUri(uri: string): void {
  mongodbUri = uri;
}

export default {
  connect: (): Promise<typeof import('mongoose')> =>
    connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions),
};
