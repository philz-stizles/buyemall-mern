const crypto = require('crypto');
const BadRequestError = require('../../errors/bad-request');
const UnAuthorizedError = require('../../errors/unauthorized');
const User = require('../../models/user.model');
const { sendPasswordResetMail } = require('../mailgun');

exports.createUser = async modelObject => {
  const existingUser = await User.findOne({ email: modelObject.email });
  if (existingUser) {
    throw new BadRequestError('User already exists');
  }

  const newUser = await User.create(modelObject);

  return newUser;
};

exports.authenticateUser = async credentials => {
  const existingUser = await User.findByAuthentication(credentials);

  return existingUser;
};

exports.activateResetPassword = async (email, req) => {
  // Validate user email
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new UnAuthorizedError('You are not authorized');
  }

  // Generate reset password token
  const token = await existingUser.createPasswordResetToken();
  // await existingUser.save({ validateBeforeSave: false }); // At this point you are setting password reset token and saving
  // The save method will run validations on inputs and will fail due to the lack of for example confirm password etc
  // set validateBeforeSave: false for this particular operation as we do not need confirm password validation here
  // Send to user as an email

  const passwordResetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetPassword/${token}`;

  const mailSent = await sendPasswordResetMail(passwordResetUrl, email);
  return mailSent;
};

exports.resetUserPassword = async (token, password, confirmPassword) => {
  // Hash unhashed password reset token
  const currentHashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // Find a user with an unexpired hashed token
  const existingUser = await User.findOne({
    passwordResetToken: currentHashedToken,
    passwordResetExpiresIn: { $gt: Date.now() },
  });
  if (!existingUser)
    throw new BadRequestError('Token is either invalid or has expired');

  existingUser.password = password;
  existingUser.confirmPassword = confirmPassword;
  existingUser.passwordResetToken = undefined;
  existingUser.passwordResetExpiresIn = undefined;
  await existingUser.save();
  return existingUser;
};

exports.reversePasswordReset = async email => {
  // Validate user email
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new UnAuthorizedError('You are not authorized');
  }

  existingUser.passwordResetToken = undefined;
  existingUser.passwordResetExpiresIn = undefined;
  existingUser.save();
  // await existingUser.save({ validateBeforeSave: false })
};

exports.findUser = async query => {
  // If you're executing a query and sending the results without modification to, say, an Express response,
  // you should use lean.In general, if you do not modify the query results and do not use custom getters,
  // you should use lean(). If you modify the query results or rely on features like getters or transforms,
  // you should not use lean().
  return User.findOne(query).lean();
};

// return omit(user.toJSON(), 'password');
