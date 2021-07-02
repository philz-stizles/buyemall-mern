const { Schema, model, Types } = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const UnAuthorizedError = require('../errors/unauthorized');

// Put as much business logic in the models to keep the controllers as simple and lean as possible
// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    username: {
      type: String,
      trim: true,
      index: true,
      unique: true,
      sparse: true,
    },
    name: {
      type: String,
      trim: true,
      index: true,
      unique: true,
      sparse: true,
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
      // select: false,
    }, // Using select: false
    // will omit the field that it is assigned to from any read executions e.g find, findOne  etc.
    // It will not omit from create, save
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpiresIn: Date,
    role: [
      {
        type: String,
        enum: ['customer', 'business', 'admin'],
        default: 'customer',
      },
    ],
    isActive: { type: Boolean, default: true, select: false },
    cart: { type: Array, default: [] },
    address: String,
    picture: String,
    wishlist: [{ type: Types.ObjectId, ref: 'Product' }],
    tokens: [{ token: { type: String, required: true } }],
  },
  { timestamps: true }
);

// Create schema methods
userSchema.pre('save', async function (next) {
  const user = this;
  // If password was not modified, do not encrypt
  if (!user.isModified('password')) return next();

  try {
    // Generate salt
    const salt = await bcrypt.genSalt(12);

    // Encrypt password
    user.password = await bcrypt.hash(user.password, salt);

    // Delete confirmPassword field
    user.confirmPassword = undefined;

    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.pre('save', async function (next) {
  const user = this;
  // If password was not modified, do not encrypt
  if (!user.isModified('password') || user.isNew) return next(); // When you change password or create a new user,
  // set passwordChange date

  user.passwordChangedAt = new Date(Date.now() - 1000);

  return next();
});

// userSchema.pre(/^find/, async next => {
//   const user = this;

//   // this points to the current query
//   user.find({ isActive: { $ne: false } }); // Not equal to false is different from is equal to true
//   next();
// });

userSchema.methods.comparePassword = async function (password) {
  // This is essentially the same as `return await bcrypt.compare();`,
  // but the rule checks only`await` in `return` statements
  const user = this;
  try {
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

userSchema.methods.isPasswordChangedAfterTokenGen = function (jwtTimestamp) {
  const user = this;
  if (!user.passwordChangedAt) return false;
  const passwordChangedAtInMilliseconds = user.passwordChangedAt.getTime();
  const passwordChangedAtInSeconds = parseInt(
    `${passwordChangedAtInMilliseconds / 1000}`,
    10
  );

  return passwordChangedAtInSeconds > jwtTimestamp;
};

userSchema.methods.createPasswordResetToken = async function () {
  const user = this;
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  user.passwordResetExpiresIn = Date.now() + 10 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  return resetToken;
};

// userSchema.pre('save', async function (next) {
//   // Do not use arrow functions here
//   const user = this;
//   // Check if password is defined and modified
//   // This middleware is attached to tsave. Thus, ensure that your update strategy is using save() and not update,
//   // else update password with a different API
//   if (user.password && user.isModified('password')) {
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(user.password, salt);
//   }

//   next();
// });

userSchema.statics.findByAuthentication = async function ({ email, password }) {
  // You can use arrow functions here as we will not be requiring
  // the 'this' reference
  const user = await this.findOne({ email });
  if (!user) {
    throw new UnAuthorizedError('Invalid Credentials');
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new UnAuthorizedError('Invalid Credentials');
  }

  return user;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: +process.env.JWT_SECRET_EXPIRES_IN } // This has been defined in
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
userSchema.methods.getPublicProfile = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;

  return userObject;
};

userSchema.methods.loginCredentials = function () {
  const user = this;
  const userObject = user.toObject();
  const { _id, fullname, email, role } = userObject;

  return { _id, email, role, fullname };
};

// userSchema.methods.toJSON = function () {
//   const user = this;

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
const User = model('User', userSchema);
module.exports = User;
