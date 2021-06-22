const User = require('../models/user');
const Product = require('../models/productModel');
const Cart = require('../models/cart');
const Coupon = require('../models/coupon');

exports.addUserCart = async (req, res) => {
  const { cart: newCart } = req.body;
  const { email } = req.user;

  // Get user to retrieve user._id from DB, firebase auth middlware may not have your db _id
  const user = await User.findOne({ email }).exec();

  // If cart for current logged-in user instance exists, remove and replace with new cart
  const existingCart = await Cart.findOne({ orderedBy: user._id }).exec();
  if (existingCart) {
    existingCart.remove();
    console.log('removed old cart');
  }

  // Process products
  let products = [];

  for (let i = 0; i < newCart.length; i++) {
    let object = {};
    const { _id, count, color } = newCart[i];
    object.product = _id;
    object.count = count;
    object.color = color;

    // get current products price
    let productFromDb = await Product.findById(_id).select('price').exec();
    object.price = productFromDb.price;

    // Add to products
    products.push(object);
  }

  // Process cart total
  let cartTotal = 0;
  for (let i = 0; i < products.length; i++) {
    cartTotal = cartTotal + products[i].price * products[i].count;
  }

  let savedCart = await new Cart({
    products,
    cartTotal,
    orderedBy: user._id,
  }).save();

  // console.log("new cart ----> ", savedCart);
  res.json({ ok: true });
};

exports.getUserCart = async (req, res) => {
  // Get user to retrieve user._id from DB, firebase auth middlware may not have
  // the users db _id
  const user = await User.findOne({ email: req.user.email }).exec();

  // Get any cart ordered by retrieved user
  const cart = await Cart.findOne({ orderedBy: user._id })
    .populate('products.product', '_id title count price totalAfterDiscount')
    .exec();

  const { products, cartTotal, totalAfterDiscount } = cart;
  res.json({ products, cartTotal, totalAfterDiscount });
};

exports.emptyUserCart = async (req, res) => {
  // Get user to retrieve user._id from DB, firebase auth middlware may not have your db _id
  const user = await User.findOne({ email: req.user.email }).exec();

  // Delete any cart ordered by retrieved user
  const cart = await Cart.findOneAndRemove({ orderedBy: user._id }).exec();
  res.json(cart);
};

exports.applyCouponToUserCart = async (req, res) => {
  const { coupon } = req.body;

  // Validate coupon
  const validCoupon = await Coupon.findOne({ name: coupon }).exec();
  if (!validCoupon) {
    return res.json({ err: 'Invalid coupon' });
  }

  // Get user to retrieve user._id from DB, firebase auth middlware may not have your db _id
  const user = await User.findOne({ email: req.user.email }).exec();

  const { products, cartTotal } = await Cart.findOne({ orderedBy: user._id })
    .populate('products.product', '_id title price')
    .exec();

  console.log('cartTotal', cartTotal, 'discount%', validCoupon.discount);

  // calculate the total after discount
  let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2); // 99.99

  Cart.findOneAndUpdate({ orderdBy: user._id }, { totalAfterDiscount }, { new: true });

  res.json(totalAfterDiscount);
};
