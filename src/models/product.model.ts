import { Schema, Types, model, Document, PopulatedDoc } from 'mongoose';
import { ICategoryDocument } from './category.model';
import { IUserDocument } from '@src/models/user.model';

interface IFileUpload {
  id: string;
  url: string;
}

interface IUserRating {
  star: number;
  postedBy: PopulatedDoc<IUserDocument & Document>;
}

export interface IProductDocument {
  title: string;
  slug: string;
  description: string;
  price: number;
  category: PopulatedDoc<ICategoryDocument & Document>;
  subs: Types.ObjectId;
  quantity: number;
  sold: number;
  images: IFileUpload[];
  shipping: string;
  color: string;
  brand: string;
  ratings: IUserRating[];
  createdAt: string;
  updatedAt: string;
}

const productSchema = new Schema<IProductDocument>(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      text: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
      text: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 32,
    },
    category: { type: Types.ObjectId, ref: 'Category' },
    subs: [{ type: Types.ObjectId, ref: 'SubCategory' }],
    quantity: Number,
    sold: { type: Number, default: 0 },
    images: [{ id: String, url: String }],
    shipping: { type: String, enum: ['Yes', 'No'] },
    color: {
      type: String,
      enum: ['Black', 'Brown', 'Silver', 'White', 'Blue'],
    },
    brand: {
      type: String,
      enum: ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS'],
    },
    ratings: [
      { star: Number, postedBy: { type: Types.ObjectId, ref: 'User' } },
    ],
  },
  { timestamps: true }
);

export default model<IProductDocument>('Product', productSchema);
