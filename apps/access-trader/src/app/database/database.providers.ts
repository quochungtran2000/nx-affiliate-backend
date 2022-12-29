/**
 * @link https://docs.nestjs.com/recipes/mongodb
 */

import * as mongoose from 'mongoose';

import { config } from '../config/configuration';
import { DB_CON_TOKEN } from './database.constant';

export const databaseProviders = [
  {
    provide: DB_CON_TOKEN,
    useFactory: async () => {
      const MONGO_USER = config.database.user || '';
      const MONGO_PASSWORD = config.database.password || '';
      const MONGO_DATABASE = config.database.dbName || '';
      const MONGO_HOST = config.database.host || '';
      const MONGO_PORT = config.database.port || '27017';
      const mongoUrl = `mongodb+srv://${MONGO_HOST}`;
      console.log({ mongoUrl });

      mongoose.set('strictQuery', false);

      return await mongoose.connect(mongoUrl, {
        dbName: MONGO_DATABASE,
        auth: {
          username: MONGO_USER,
          password: MONGO_PASSWORD,
        },
      });
    },
  },
];
