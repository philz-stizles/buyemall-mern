const _ = require('lodash');
const jwt = require('jsonwebtoken');
const shortId = require('shortid');
const { generateToken } = require('../utils/auth.utils');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user.model');
const { createAndSendTokenWithCookie } = require('../utils/api.utils');
const awsService = require('../services/aws/ses.services');
const {
  createUser,
  authenticateUser,
  activateResetPassword,
  reversePasswordReset,
  resetUserPassword,
} = require('../services/mongo/user.services');
const BadRequestError = require('../errors/bad-request');

exports.signup = async (req, res, next) => {
  const { fullname, email, password, confirmPassword, accountType } = req.body;

  try {
    const newUser = await createUser({
      fullname,
      email,
      password,
      confirmPassword,
      accountType,
      role: [accountType],
    });
    const token = generateToken({ id: newUser._id });

    res.status(201).json({
      status: true,
      data: {
        user: _.omit(newUser.toJSON(), ['password']),
        token,
      },
      message: 'created successfully',
    });
  } catch (error) {
    next(error);
  }
};

exports.signupWithEmailVerification = (req, res) => {
  const { name, email, password } = req.body;

  // Check if user exists
  // eslint-disable-next-line consistent-return
  User.findOne({ email }).exec((findError, existingUser) => {
    if (findError) {
      return res
        .status(400)
        .json({ status: false, data: req.body, message: findError.message });
    }

    if (existingUser) {
      return res.status(400).json({
        status: false,
        data: req.body,
        message: 'User is already taken',
      });
    }

    // Generate token with user's name, email and password
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: +process.env.JWT_ACCOUNT_ACTIVATION_EXPIRES_IN,
      }
    );

    // Send email verification message
    awsService
      .sendAccountActivationMail(email, token)
      .then(data => {
        console.log('Email submitted to SES', data);
        res.send({
          status: true,
          message: `Email has been sent to ${email}. Follow the instructions to complete your registration`,
        });
      })
      .catch(error => {
        console.log(error);
        res.status(500).send({
          status: false,
          message: 'We could not verify your email, please try again',
        });
      });
  });
};

exports.emailActivation = (req, res) => {
  const { token } = req.body;

  // Check that activation token has not expred
  jwt.verify(
    token,
    process.env.JWT_ACCOUNT_ACTIVATION,
    // eslint-disable-next-line consistent-return
    (jwtError, decodedToken) => {
      if (jwtError) {
        console.log(jwtError);
        return res
          .status(401)
          .send({ status: false, message: 'Expired link: Try again' });
      }

      const { name, email, password, categories } = decodedToken;

      // Check if email already exists
      // eslint-disable-next-line consistent-return
      User.findOne({ email }).exec((findError, existingUser) => {
        if (findError) {
          return res.status(400).json({
            status: false,
            data: req.body,
            message: findError.message,
          });
        }

        if (existingUser) {
          return res
            .status(400)
            .json({ status: false, data: req.body, message: 'Email is taken' });
        }

        // Generate username
        const username = shortId.generate();
        const newUser = new User({
          name,
          username,
          email,
          password,
          categories,
        });
        newUser.save((createError, user) => {
          if (createError) {
            return res.status(400).json({
              status: false,
              data: user,
              message: 'Could not save user credentials, please try again',
            });
          }

          return res.status(201).json({
            status: true,
            data: user,
            message: 'Registration successful, please login',
          });
        });
      });
    }
  );
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Authenticate by verifying the users email and password
    const existingUser = await authenticateUser({ email, password });

    return createAndSendTokenWithCookie(
      existingUser,
      200,
      req,
      res,
      'Login successful'
    );
  } catch (error) {
    return next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    // Generate reset password token
    const mailSent = await activateResetPassword(email, req);

    console.log('auth', mailSent);

    if (!mailSent) {
      reversePasswordReset(email);
      throw new BadRequestError(
        'Password cannot be reset at this time. Please try again later'
      );
    }

    return res.json({
      status: true,
      message: 'Password reset has been sent to your email',
    });
  } catch (error) {
    return next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const { token } = req.params;

  try {
    const existingUser = await resetUserPassword(
      token,
      password,
      confirmPassword
    );

    // Generate token
    const loginToken = generateToken({ id: existingUser._id });

    return res.json({
      status: true,
      data: loginToken,
      message: 'Password reset successful',
    });
  } catch (error) {
    return next(error);
  }
};

exports.logoutCookie = catchAsync(async (req, res) => {
  res.cookie('token', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.json({ status: true, message: 'Logout successful' });
});

exports.changePassword = catchAsync(async (req, res) => {
  res.json({ status: true, message: 'Logout successful' });
});
