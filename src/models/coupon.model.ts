import { Schema, model, Types, Document, PopulatedDoc } from 'mongoose';
import { IUserDocument } from './user.model';

export interface ICouponDocument {
  name: string;
  expiry: Date;
  discount: number;
  createdBy: PopulatedDoc<IUserDocument & Document>;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<ICouponDocument>(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      uppercase: true,
      required: [true, 'Name is required'],
      minlength: [6, 'Too short'],
      maxlength: [12, 'Too long'],
    },
    expiry: { type: Date, required: true },
    discount: { type: Number, required: true },
    createdBy: { type: Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default model<ICouponDocument>('Coupon', schema);
