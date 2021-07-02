const BadRequestError = require('../../errors/bad-request');
const NotFoundError = require('../../errors/not-found');
const Coupon = require('../../models/coupon.model');

exports.create = async modelObject => {
  const existingCoupon = await Coupon.findOne({ name: modelObject.name });
  if (existingCoupon) {
    throw new BadRequestError('Coupon already exists');
  }

  const newCoupon = await Coupon.create(modelObject);

  return newCoupon;
};

exports.findBySlug = async query => {
  const targetCoupon = await Coupon.findOne(query);
  if (!targetCoupon) {
    throw new NotFoundError('Coupon does not exist');
  }
  return targetCoupon;
};

exports.list = async (query, options = { lean: true }) => {
  // If you're executing a query and sending the results without modification to, say, an Express response,
  // you should use lean.In general, if you do not modify the query results and do not use custom getters,
  // you should use lean(). If you modify the query results or rely on features like getters or transforms,
  // you should not use lean().
  return Coupon.find(query, {}, options);
};

exports.update = async (query, update, options = { new: true }) => {
  const targetCoupon = await Coupon.findOneAndUpdate(query, update, options);
  if (!targetCoupon) {
    throw new NotFoundError('Coupon does not exist');
  }
  return targetCoupon;
};

exports.delete = async query => {
  const targetCoupon = await Coupon.deleteOne(query);
  if (!targetCoupon) {
    throw new NotFoundError('Coupon does not exist');
  }
  return targetCoupon;
};
