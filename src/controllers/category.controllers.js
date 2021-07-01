const slugify = require('slugify');
const Category = require('../models/category.model');
const Product = require('../models/product.model');
const Sub = require('../models/subCategory.model');

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await new Category({ name, slug: slugify(name) }).save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).send('Create category failed');
  }
};

exports.list = async (req, res) => {
  const categories = await Category.find({}).sort({ createdAt: -1 }).exec();
  res.json(categories);
};

exports.read = async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug }).exec();
  if (!category) {
    return res.status(404).json({ status: false });
  }

  const products = await Product.find({
    category,
  })
    .populate('category')
    .exec();
  // const products = await Product.find({ category }).populate('category').exec();

  return res.json({ category, products });
};

exports.update = async (req, res) => {
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

exports.remove = async (req, res) => {
  try {
    const deletedCategory = await Category.findOneAndDelete({
      slug: req.params.slug,
    });
    res.json(deletedCategory);
  } catch (err) {
    res.status(400).send('Create delete failed');
  }
};

exports.getCategorySubs = (req, res) => {
  return Sub.find({ parent: req.params._id }).exec((err, subs) => {
    if (err) {
      console.log(err);
      return res.status(400);
    }
    return res.json(subs);
  });
};
