const UnAuthorizedError = require('../errors/unauthorized');
const User = require('../models/user.model');
const AppError = require('../utils/app.error');
const { verifyToken } = require('../utils/auth.utils');

exports.authenticate = async (req, res, next) => {
  // Check if there is a token
  let token = '';
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    // eslint-disable-next-line prefer-destructuring
    token = req.cookies.token;
  }

  console.log(token);

  if (!token)
    return next(new UnAuthorizedError('You are not logged in. Please log'));

  // Check if token is valid
  const decodedToken = await verifyToken(token);
  console.log(decodedToken);
  if (!decodedToken)
    return next(new UnAuthorizedError('You are not authorized. Please log'));

  // Check if user exists(or if a previously existing user with a valid token has been deleted)
  // and return user if true
  const existingUser = await User.findById(decodedToken.id);
  if (!existingUser)
    return next(
      new UnAuthorizedError('You no longer have access to this resource')
    );

  // Check if user changed password after JWT was created passing the issued at(iat) value
  const passwordChangedAfterTokenGen =
    existingUser.isPasswordChangedAfterTokenGen(decodedToken.iat);
  if (passwordChangedAfterTokenGen)
    return next(
      new UnAuthorizedError(
        'You recently changed your password! Please log in again.'
      )
    );

  // Grant access to protected route
  req.user = existingUser;

  return next();
};

exports.authorize =
  (...authorizedUsers) =>
  async (req, res, next) => {
    if (!authorizedUsers.includes(req.user.role)) {
      return next(
        new AppError(
          'You do not have the permission to perform this action',
          403
        )
      );
    }

    return next();
  };
