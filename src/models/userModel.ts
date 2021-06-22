import { Schema, model, Document, Types, HookNextFunction } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// 1. Create an interface representing a document in MongoDB.
export interface UserDocument extends Document {
  name: string;
  email: string;
  avatar?: string;
  password?: string;
  confirmPassword?: string;
  passwordChangedAt?: Date;
  passwordResetExpiresIn?: number;
  passwordResetToken: string | undefined;
  role: string;
  // eslint-disable-next-line no-unused-vars
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  createPasswordResetToken: () => string;
  // eslint-disable-next-line no-unused-vars
  isPasswordChangedAfterTokenGen: (issuedAt: number) => boolean;
}

// Put as much business logic in the models to keep the controllers as simple and lean as possible
// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: [true, 'A user must have a name'], trim: true, unique: true },
    email: {
      type: String,
      required: [true, 'A user must have an email'],
      trim: true,
      unique: true,
      index: true,
      lowercase: true,
    },
    avatar: { type: String, default: 'default.jpg' },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minLength: 8,
      select: false,
    }, // Using select: false
    // will omit the field that it is assigned to from any read executions e.g find, findOne  etc.
    // It will not omit from create, save
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpiresIn: Date,
    role: { type: String, enum: ['customer', 'business', 'admin'], default: 'customer' },
    isActive: { type: Boolean, default: true, select: false },
    cart: { type: Array, default: [] },
    address: String,
    picture: String,
    wishlist: [{ type: Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next: HookNextFunction) {
  const user = this as UserDocument;
  // If password was not modified, do not encrypt
  if (!user.isModified('password')) return next();

  try {
    // Generate salt
    const salt = await bcrypt.genSalt(12);

    // Encrypt password
    user.password = await bcrypt.hash(user.password as string, salt);

    // Delete confirmPassword field
    user.confirmPassword = undefined;

    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.pre('save', async function (next) {
  // If password was not modified, do not encrypt
  if (!this.isModified('password') || this.isNew) return next(); // When you change password or create a new user,
  // set passwordChange date

  this.passwordChangedAt = new Date(Date.now() - 1000);

  return next();
});

// userSchema.pre(/^find/, async next => {
//   const user = this as UserDocument;

//   // this points to the current query
//   user.find({ isActive: { $ne: false } }); // Not equal to false is different from is equal to true
//   next();
// });

userSchema.methods.comparePassword = async function (password: string) {
  // This is essentially the same as `return await bcrypt.compare();`,
  // but the rule checks only`await` in `return` statements
  const user = this as UserDocument;
  try {
    const isMatch = await bcrypt.compare(password, user.password as string);
    return isMatch;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

userSchema.methods.isPasswordChangedAfterTokenGen = function (jwtTimestamp): boolean {
  if (!this.passwordChangedAt) return false;
  const passwordChangedAtInMilliseconds = this.passwordChangedAt.getTime();
  const passwordChangedAtInSeconds = parseInt(`${passwordChangedAtInMilliseconds / 1000}`, 10);

  return passwordChangedAtInSeconds > jwtTimestamp;
};

userSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  this.passwordResetExpiresIn = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// 3. Create a Model.
const User = model<UserDocument>('User', userSchema);
export default User;
