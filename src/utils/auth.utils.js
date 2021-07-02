const { promisify } = require('util');
const jwt = require('jsonwebtoken');

exports.generateToken = payload =>
  jwt.sign(payload, process.env.JWT_AUTH_SECRET, {
    expiresIn: process.env.JWT_AUTH_EXPIRES_IN,
  });

exports.verifyToken = async token => {
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_AUTH_SECRET
  );
  return decodedToken;
};
