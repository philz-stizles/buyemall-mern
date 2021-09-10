import { Schema, model, Document, Types } from 'mongoose';

interface IUpload {
  url: string;
  uploadId: string;
  main: boolean;
}

// 1. Create an type from a document in MongoDB.
export type IVendorDocument = Document & {
  name: string;
  logo: string;
  bio: string;
  locations?: string[];
  images?: IUpload[];
  users: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
};

// Put as much vendor logic in the models to keep the controllers as simple and lean as possible
// 2. Create a Schema corresponding to the document interface.
const vendorSchema = new Schema<IVendorDocument>(
  {
    name: {
      type: String,
      required: [true, 'A user must have a name'],
      trim: true,
      unique: true,
    },
    bio: {
      type: String,
      required: [true, 'A user must have a name'],
      trim: true,
    },
    logo: { type: Buffer, required: true },
    locations: [String],
    images: [
      {
        url: String,
        uploadId: String,
      },
    ],
    users: [{ type: Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

// 3. Create a Model.
const Vendor = model<IVendorDocument>('Vendor', vendorSchema);

export default Vendor;
