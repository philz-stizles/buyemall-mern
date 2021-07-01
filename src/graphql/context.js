const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const context = async ({ req }) => {
  // Note: This example uses the `req` argument to access headers,
  // but the arguments received by `context` vary by integration.
  // This means they vary for Express, Koa, Lambda, etc.
  //
  // To find out the correct arguments for a specific integration,
  // see https://www.apollographql.com/docs/apollo-server/api/apollo-server/#middleware-specific-context-fields

  // Check if Authorization header exists
  // const token = req.headers.authorization || '';
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    // throw new AuthenticationError('you must be logged in');
    return { isAuthenticated: false, user: null };
  }

  // get the user token from the headers
  const token = authHeader.split(' ')[1];
  let decodedToken;

  // Verify token
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    // throw new AuthenticationError(error.message);
    return { isAuthenticated: false, user: null };
  }

  if (!decodedToken) {
    // throw new AuthenticationError('you must be logged in');
    return { isAuthenticated: false, user: null };
  }

  // try to retrieve a user with the token
  const user = await User.findById(decodedToken.userId);
  if (!user) {
    // throw new AuthenticationError('Please register to complete this process');
    return { isAuthenticated: false, user: null };
  }

  // we could also check user roles/permissions here

  // optionally block the user

  // add auth properties(e.g isAuthenticated, user etc) to the context
  return { isAuthenticated: true, user };
};

module.exports = context;
