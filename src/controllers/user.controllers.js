const _ = require('lodash');
const User = require('../models/user.model');
const {
  filterRequestBody,
  createAndSendTokenWithCookie,
} = require('../utils/api.utils');
const AppError = require('../utils/app.error');
const { generateToken } = require('../utils/auth.utils');
const factory = require('../factories/handler.factory');
const Order = require('../models/order.model');

export const createUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  const newUser = await User.create({ name, email, password, confirmPassword });

  const token = generateToken(newUser);

  res.status(201).json({
    status: true,
    data: {
      user: _.omit(newUser, 'password'), // newUser.toJSON()
      token,
    },
    message: 'created successfully',
  });
};

export const createOrUpdate = async (req, res) => {
  console.log(req.user);
  const { name, avatar, email } = req.user;
  console.log('before');
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { name, avatar },
      { new: true }
    );

    console.log('after');

    if (user) {
      console.log('USER UPDATED', user);
      res.json(user);
    } else {
      const newUser = await new User({
        email,
        name: email.split('@')[0],
        avatar,
      }).save();
      console.log('USER CREATED', newUser);
      res.json(newUser);
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const updateMe = async (req, res, next) => {
  // Check that password is not being updated here
  if (req.body.password || req.body.confirmPassword) {
    return next(new AppError('You cannot update passwords', 400));
  }

  const filteredBody = filterRequestBody(req.body, 'name', 'email');

  // Check if a file was uploaded
  if (req.file) {
    filteredBody.photo = req.file.filename;
  }

  // We use User.findByIdAndUpdate() now since we are not updating password and thus do not require validations
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  return res.json({
    status: true,
    data: updatedUser,
    message: 'Updated successfully',
  });
};

export const deleteMe = async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: false });

  res.status(204).json({ status: true, data: null });
};

export const changePassword = async (req, res, next) => {
  // Check if user exists - Find the user by id
  const existingUser = await User.findById(req.user.id).select('+password');
  if (!existingUser) return next(new AppError('user invalid', 400));

  // Verify current password
  if (!(await existingUser.comparePassword(req.body.currentPassword))) {
    return next(new AppError('Your current password is wrong', 401));
  }

  // set new password
  existingUser.password = req.body.password;
  existingUser.confirmPassword = req.body.confirmPassword;
  await existingUser.save();
  // User.findByIdAndUpdate will not work as intended if used here

  // Generate token and respond to API request
  return createAndSendTokenWithCookie(
    existingUser,
    200,
    req,
    res,
    'Password changed successfully'
  );
};

// USING HANDLER FACTORY
export const getAllUsers = factory.getAll(User);
export const getUser = factory.getOne(User);
export const updateUser = factory.updateOne(User);
export const deleteUser = factory.deleteOne(User);

export const getCurrentUser = async (req, res) => {
  User.findOne({ email: req.user.email }).exec((error, existingUser) => {
    console.log(error, existingUser);
    if (error || !existingUser) throw new Error(error?.message);

    res.json(existingUser);
  });
};

export const saveUserAddress = async (req, res) => {
  await User.findOneAndUpdate(
    { email: req.user.email },
    { address: req.body.address }
  ).exec();

  res.json({ ok: true });
};

export const addToWishlist = async (req, res) => {
  const { productId } = req.body;

  await User.findOneAndUpdate(
    { email: req.user.email },
    { $addToSet: { wishlist: productId } } // This will manage duplicate
  ).exec();

  res.json({ ok: true });
};

export const wishlist = async (req, res) => {
  const userWishList = await User.findOne({ email: req.user.email })
    .select('wishlist')
    .populate('wishlist')
    .exec();

  res.json(userWishList);
};

export const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  await User.findOneAndUpdate(
    { email: req.user.email },
    { $pull: { wishlist: productId } }
  ).exec();

  res.json({ ok: true });
};

export const getAllOrders = async (_req, res) => {
  const allOrders = await Order.find({})
    .sort('-createdAt')
    .populate('products.product')
    .exec();

  res.json(allOrders);
};

export const updateOrderStatus = async (req, res) => {
  const { orderId, orderStatus } = req.body;

  const updated = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus },
    { new: true }
  ).exec();

  res.json(updated);
};

// MIDDLEWARES
export const getMe = async (req, next) => {
  req.params.id = req.user.id;
  next();
};
