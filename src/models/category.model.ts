import { Schema, model, Types, Document, PopulatedDoc } from 'mongoose';
import { IUserDocument } from '@src/models/user.model';

export interface ICategoryDocument {
  name: string;
  slug: string;
  createdBy: PopulatedDoc<IUserDocument & Document>;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<ICategoryDocument>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required'],
      minlength: [2, 'Too short'],
      maxlength: [32, 'Too long'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
      required: true,
    },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Category = model<ICategoryDocument>('Category', schema);

export default Category;
