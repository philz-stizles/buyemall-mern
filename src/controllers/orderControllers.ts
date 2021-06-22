const User = require('../models/user');
const Product = require('../models/productModel');
const Cart = require('../models/cart');
const Order = require('../models/orderModel');

exports.create = async (req, res) => {
  const { paymentIntent } = req.body.stripeResponse;

  // Get user to retrieve user._id from DB, firebase auth middlware may not have
  // the users db _id
  const user = await User.findOne({ email: req.user.email }).exec();

  let { products } = await Cart.findOne({ orderedBy: user._id }).exec();

  let newOrder = await new Order({
    products,
    paymentIntent,
    orderdBy: user._id,
  }).save();

  // decrement quantity, increment sold
  let bulkOption = products.map(item => {
    return {
      updateOne: {
        filter: { _id: item.product._id }, // IMPORTANT item.product
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });

  let updated = await Product.bulkWrite(bulkOption, {});
  console.log('PRODUCT QUANTITY-- AND SOLD++', updated);

  console.log('NEW ORDER SAVED', newOrder);
  res.json({ ok: true });
};

exports.list = async (req, res) => {
  // Get user to retrieve user._id from DB, firebase auth middlware may not have
  // the users db _id
  let user = await User.findOne({ email: req.user.email }).exec();

  let orders = await Order.find({ orderdBy: user._id }).populate('products.product').exec();

  res.json(orders);
};
