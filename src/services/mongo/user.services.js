const { omit } = require('lodash');
const BadRequestError = require('../../errors/bad-request');
const User = require('../../models/user.model');

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

exports.findUser = async query => {
  // If you're executing a query and sending the results without modification to, say, an Express response,
  // you should use lean.In general, if you do not modify the query results and do not use custom getters,
  // you should use lean(). If you modify the query results or rely on features like getters or transforms,
  // you should not use lean().
  return User.findOne(query).lean();
};

exports.validatePassword = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) {
    return false;
  }

  return omit(user.toJSON(), 'password');
};
