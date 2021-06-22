const Category = require('../models/category');
const Product = require('../models/productModel');
const Sub = require('../models/subCategory');
const slugify = require('slugify');

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await new Category({ name, slug: slugify(name) }).save();
    res.status(201).json(category);
  } catch (err) {
    // console.log(err);
    res.status(400).send('Create category failed');
  }
};

exports.list = async (req, res) => {
  const categories = await Category.find({}).sort({ createdAt: -1 }).exec();
  res.json(categories);
};

exports.read = async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug }).exec();
  const products = await Product.find({ category }).populate('category').exec();

  res.json({ category, products });
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
    const deletedCategory = await Category.findOneAndDelete({ slug: req.params.slug });
    res.json(deletedCategory);
  } catch (err) {
    res.status(400).send('Create delete failed');
  }
};

exports.getCategorySubs = (req, res) => {
  Sub.find({ parent: req.params._id }).exec((err, subs) => {
    if (err) console.log(err);
    res.json(subs);
  });
};
