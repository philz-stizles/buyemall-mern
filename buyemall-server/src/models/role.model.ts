import { Schema, Types, model, Document } from 'mongoose';
// import { IUserDocument } from '@src/models/user.model';

export interface IRoleDocument extends Document {
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
  // createdBy: PopulatedDoc<IUserDocument & Document>;
  createdAt: string;
  updatedAt: string;
}

// Put as much business logic in the models to keep the controllers as simple and lean as possible
const roleSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'A role must have a name'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'A role must have a description'],
      trim: true,
    },
    isActive: { type: Boolean, default: true, select: false, required: true },
    permissions: Schema.Types.Mixed,
    // createdBy: { type: Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Role = model<IRoleDocument>('Role', roleSchema);

export default Role;
