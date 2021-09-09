import { Schema, model, Types, Document, PopulatedDoc, Model } from 'mongoose';
import { IUserDocument } from './user.model';

export interface ICoupon {
  name: string;
  expiry: Date;
  discount: number;
  isActive: boolean;
  createdBy: PopulatedDoc<IUserDocument & Document>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICouponDocument extends ICoupon, Document {}

export interface ICouponModel extends Model<ICouponDocument> {
  findByAuthentication(email: string, password: string): Promise<void | any>;
}

const schema = new Schema<ICouponDocument, ICouponModel>(
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
    isActive: { type: Boolean, required: true, default: false },
    createdBy: { type: Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default model<ICouponDocument, ICouponModel>('Coupon', schema);
