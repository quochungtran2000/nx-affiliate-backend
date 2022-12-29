import { MerchantSchema } from '@shared/models/entities';
import { Connection } from 'mongoose';
import { DB_CON_TOKEN } from '../database/database.constant';

export const merchantProviders = [
  {
    provide: 'MERCHANT_MODEL',
    useFactory: (connection: Connection) => connection.model('merchantModel', MerchantSchema, 'merchant'),
    inject: [DB_CON_TOKEN],
  },
];
