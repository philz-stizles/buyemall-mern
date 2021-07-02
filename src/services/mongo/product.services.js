const BadRequestError = require('../../errors/bad-request');
const NotFoundError = require('../../errors/not-found');
const Product = require('../../models/product.model.js');

exports.create = async modelObject => {
  const existingProduct = await Product.findOne({ name: modelObject.name });
  if (existingProduct) {
    throw new BadRequestError('Product already exists');
  }

  const newProduct = await Product.create(modelObject);

  return newProduct;
};

exports.findBySlug = async query => {
  const targetProduct = await Product.findOne(query);
  if (!targetProduct) {
    throw new NotFoundError('Product does not exist');
  }
  return targetProduct;
};

exports.list = async (query, options = { lean: true }) => {
  // If you're executing a query and sending the results without modification to, say, an Express response,
  // you should use lean.In general, if you do not modify the query results and do not use custom getters,
  // you should use lean(). If you modify the query results or rely on features like getters or transforms,
  // you should not use lean().
  return Product.find(query, {}, options);
};

exports.update = async (query, update, options = { new: true }) => {
  const targetProduct = await Product.findOneAndUpdate(query, update, options);
  if (!targetProduct) {
    throw new NotFoundError('Product does not exist');
  }
  return targetProduct;
};

exports.delete = async query => {
  const targetProduct = await Product.deleteOne(query);
  if (!targetProduct) {
    throw new NotFoundError('Product does not exist');
  }
  return targetProduct;
};
