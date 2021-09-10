/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, model, Types, Document, PopulatedDoc, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { IRoleDocument } from '@src/models/role.model';

interface IUserToken {
  token: string;
}

// Create an interface representing a document in MongoDB.
export interface IUser {
  fullname: string;
  username: string;
  name: string;
  email: string;
  avatar?: string;
  password?: string;
  confirmPassword?: string;
  passwordChangedAt?: Date;
  passwordResetExpiresIn?: number;
  passwordResetToken: string | undefined;
  roles: PopulatedDoc<IRoleDocument & Document>[];
  // eslint-disable-next-line no-unused-vars
  // comparePassword: (candidatePassword: string) => Promise<boolean>;
  // createPasswordResetToken: () => string;
  // // eslint-disable-next-line no-unused-vars
  // isPasswordChangedAfterTokenGen: (issuedAt: number) => boolean;
  isActive: boolean;
  tokens: IUserToken[];
  createdAt: string;
  updatedAt: string;
}

export interface IUserDocument extends IUser, Document {
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  createPasswordResetToken: () => string;
  // eslint-disable-next-line no-unused-vars
  isPasswordChangedAfterTokenGen: (issuedAt: number) => boolean;
}

export interface IUserModel extends Model<IUserDocument> {
  findByAuthentication(email: string, password: string): Promise<void | any>;
}

// Put as much business logic in the models to keep the controllers as simple and lean as possible
// 2. Create a Schema corresponding to the document interface.
const schema = new Schema<IUserDocument, IUserModel>(
  {
    fullname: {
      type: String,
      required: [true, 'A user must have a fullname'],
      trim: true,
    },
    username: {
      type: String,
      trim: true,
      // `email` must be unique, unless it isn't defined
      index: { unique: true, sparse: true },
    },
    name: {
      type: String,
      trim: true,
    },
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
      minLength: 6,
      select: false,
    }, // Using select: false
    // will omit the field that it is assigned to from any read executions e.g find, findOne  etc.
    // It will not omit from create, save
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpiresIn: Date,
    roles: [{ type: Types.ObjectId, ref: 'Role' }],
    isActive: { type: Boolean, default: true, select: false },

    address: String,
    picture: String,

    tokens: [{ token: { type: String, required: true } }],
  },
  { timestamps: true }
);

// Create schema methods
schema.pre('save', async function (next: any) {
  const user = this as IUserDocument;
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
  } catch (error: any) {
    return next(error);
  }
});

schema.pre('save', async function (next) {
  const user = this as IUserDocument;
  // If password was not modified, do not encrypt
  if (!user.isModified('password') || user.isNew) return next(); // When you change password or create a new user,
  // set passwordChange date

  user.passwordChangedAt = new Date(Date.now() - 1000);

  return next();
});

// schema.pre(/^find/, async next => {
//   const user = this as IUserDocument;

//   // this points to the current query
//   user.find({ isActive: { $ne: false } }); // Not equal to false is different from is equal to true
//   next();
// });

schema.methods.comparePassword = async function (password: string) {
  // This is essentially the same as `return await bcrypt.compare();`,
  // but the rule checks only`await` in `return` statements
  const user = this as IUserDocument;
  try {
    const isMatch = await bcrypt.compare(password, user.password as string);
    return isMatch;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return false;
  }
};

schema.methods.isPasswordChangedAfterTokenGen = function (
  jwtTimestamp
): boolean {
  const user = this as IUserDocument;
  if (!user.passwordChangedAt) return false;
  const passwordChangedAtInMilliseconds = user.passwordChangedAt.getTime();
  const passwordChangedAtInSeconds = parseInt(
    `${passwordChangedAtInMilliseconds / 1000}`,
    10
  );

  return passwordChangedAtInSeconds > jwtTimestamp;
};

schema.methods.createPasswordResetToken = function (): string {
  const user = this as IUserDocument;
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  user.passwordResetExpiresIn = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// schema.pre('save', async function (next) {
//   // Do not use arrow functions here
//   const user = this as IUserDocument;
//   // Check if password is defined and modified
//   // This middleware is attached to tsave. Thus, ensure that your update strategy is using save() and not update,
//   // else update password with a different API
//   if (user.password && user.isModified('password')) {
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(user.password, salt);
//   }

//   next();
// });

schema.statics.findByAuthentication = async (
  email: string,
  password: string
): Promise<void | any> => {
  // You can use arrow functions here as we will not be requiring
  // the 'this' reference
  // eslint-disable-next-line no-use-before-define
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid Credentials');
  }

  const isMatch = await user.comparePassword(password);
  // console.log(isMatch)
  if (!isMatch) {
    throw new Error('Invalid Credentials');
  }

  return user;
};

schema.methods.generateAuthToken = async function () {
  const user = this as IUserDocument;
  const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_SECRET as string,
    { expiresIn: +(process.env.JWT_SECRET_EXPIRES_IN as string) } // This has been defined in
    // env variables in seconds 1800 => 30mins
    // + is added to convert it from string to an integer as it will assume milliseconds
    // if string is detected
  );

  // Store current login in DB, this strategy enable a user to login from multiple devices and stay logged unless
  // the user logs out which will logout the current requesting device
  user.tokens = user.tokens.concat({ token });
  await user.save();

  // Return generated token
  return token;
};

// Utility method to return users public profile
schema.methods.getPublicProfile = function () {
  const user = this as IUserDocument;
  const userObject = user.toObject();

  delete userObject.password;

  return userObject;
};

// schema.methods.toJSON = function () {
//   const user = this as IUserDocument;

//   // Create a JSON representation of the user
//   const userObject = user.toObject();

//   // Remove private data
//   delete userObject.password;
//   delete userObject.tokens;
//   delete userObject.avatar; // Remove avatar here coz the data is large for JSON requests

//   // Return public profile
//   return userObject;
// };

// Create a Model.
const User = model<IUserDocument, IUserModel>('User', schema);
export default User;
