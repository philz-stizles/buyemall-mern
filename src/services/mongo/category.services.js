const BadRequestError = require('../../errors/bad-request');
const NotFoundError = require('../../errors/not-found');
const Category = require('../../models/category.model');

exports.create = async modelObject => {
  const existingCategory = await Category.findOne({ name: modelObject.name });
  if (existingCategory) {
    throw new BadRequestError('Category already exists');
  }

  const newCategory = await Category.create(modelObject);

  return newCategory;
};

exports.findBySlug = async query => {
  const targetCategory = await Category.findOne(query);
  if (!targetCategory) {
    throw new NotFoundError('Category does not exist');
  }
  return targetCategory;
};

exports.list = async (query, options = { lean: true }) => {
  // If you're executing a query and sending the results without modification to, say, an Express response,
  // you should use lean.In general, if you do not modify the query results and do not use custom getters,
  // you should use lean(). If you modify the query results or rely on features like getters or transforms,
  // you should not use lean().
  return Category.find(query, {}, options);
};

exports.update = async (query, update, options = { new: true }) => {
  const targetCategory = await Category.findOneAndUpdate(
    query,
    update,
    options
  );
  if (!targetCategory) {
    throw new NotFoundError('Category does not exist');
  }
  return targetCategory;
};

exports.delete = async query => {
  const targetCategory = await Category.deleteOne(query);
  if (!targetCategory) {
    throw new NotFoundError('Category does not exist');
  }
  return targetCategory;
};
