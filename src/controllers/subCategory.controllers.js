const slugify = require('slugify');
const SubCategory = require('../models/subCategory.model');
const Product = require('../models/product.model');

export const create = async (req, res) => {
  try {
    const { name, parent } = req.body;
    res.json(
      await new SubCategory({ name, parent, slug: slugify(name) }).save()
    );
  } catch (err) {
    console.log('Sub category CREATE ERR ----->', err);
    res.status(400).send('Create Sub category failed');
  }
};

export const list = async (req, res) =>
  res.json(await SubCategory.find({}).sort({ createdAt: -1 }).exec());

export const read = async (req, res) => {
  const subCategory = await SubCategory.findOne({
    slug: req.params.slug,
  }).exec();
  const products = await Product.find({
    subs: subCategory,
  })
    .populate('category')
    .exec();

  res.json({ subCategory, products });
};

export const update = async (req, res) => {
  const { name, parent } = req.body;
  try {
    const updated = await SubCategory.findOneAndUpdate(
      { slug: req.params.slug },
      { name, parent, slug: slugify(name) },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).send('Sub category update failed');
  }
};

export const remove = async (req, res) => {
  try {
    const deleted = await SubCategory.findOneAndDelete({
      slug: req.params.slug,
    });
    res.json(deleted);
  } catch (err) {
    res.status(400).send('Sub category delete failed');
  }
};
