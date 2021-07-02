const slugify = require('slugify');
const Category = require('../models/category.model');
const Product = require('../models/product.model');
const Sub = require('../models/subCategory.model');

exports.createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const category = await new Category({
      name,
      slug: slugify(name),
      description,
      creator: req.user._id,
    }).save();
    return res.status(201).json(category);
  } catch (error) {
    return next(error);
  }
};

exports.list = async (req, res, next) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 }).exec();
    return res.json(categories);
  } catch (error) {
    return next(error);
  }
};

exports.listMyCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ creator: req.user._id })
      .sort({ createdAt: -1 })
      .exec();
    return res.json(categories);
  } catch (error) {
    console.log(error.message);
    return next(error);
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).exec();
    if (!category) {
      return res.status(404).json({ status: false });
    }

    return res.json({ category });
  } catch (error) {
    return next(error);
  }
};

exports.getCategoryAndProducts = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).exec();
    if (!category) {
      return res.status(404).json({ status: false });
    }

    const products = await Product.find({
      category,
    })
      .populate('category')
      .exec();

    return res.json({ category, products });
  } catch (error) {
    return next(error);
  }
};

exports.updateCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const updatedCategory = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name) },
      { new: true }
    );
    res.json(updatedCategory);
  } catch (err) {
    res.status(400).send('Create update failed');
  }
};

exports.removeCategory = async (req, res, next) => {
  try {
    const deletedCategory = await Category.findOneAndDelete({
      slug: req.params.slug,
    });
    return res.json(deletedCategory);
  } catch (error) {
    return next(error);
  }
};

exports.getCategoryAndSubs = (req, res) => {
  return Sub.find({ parent: req.params._id }).exec((err, subs) => {
    if (err) {
      console.log(err);
      return res.status(400);
    }
    return res.json(subs);
  });
};
