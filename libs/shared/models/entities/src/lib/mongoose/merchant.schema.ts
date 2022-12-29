import * as mongoose from 'mongoose';

export const MerchantSchema = new mongoose.Schema({
  id: String,
  key: String,
  active: Boolean,
  display_name: String,
  type: String,
  total_offer: Number,
  merchant_id: String,
  logo: String,
  path: String,
  target: String,
});

export interface IMerchant extends mongoose.Document {
  readonly id: string;
  readonly key: string;
  readonly active: boolean;
  readonly display_name: string;
  readonly type: string;
  readonly total_offer: number;
  readonly merchant_id: string;
  readonly logo: string;
  readonly path: string;
  readonly target: string;
}
