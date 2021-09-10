/* eslint-disable import/prefer-default-export */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { FilterQuery } from 'mongoose';
import { Request, Response } from 'express';
import slugify from 'slugify';
import Category from '@src/models/category.model';
import Product from '@src/models/product.model';
import Sub from '@src/models/sub-category.model';
import AppError from '@src/errors/app.error';

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    const newCategory = await new Category({
      name,
      slug: slugify(name),
      createdBy: req.user._id,
    }).save();
    res.status(201).json({
      status: true,
      data: newCategory,
      message: 'Created successfully',
    });
  } catch (err: any) {
    console.log('CREATE CATEGORY ERR', err.message);
    res.status(400).send('Create category failed');
  }
};

export const list = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 });
    res.json({
      status: true,
      data: categories,
      message: 'Retrieved successful',
    });
  } catch (error: any) {
    console.log(error.message);
    throw new AppError(
      'Cannot retrieve categories at the moment, try again later',
      500
    );
  }
};

export const read = async (req: Request, res: Response): Promise<Response> => {
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

export const update = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;
  try {
    const updatedCategory = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name) },
      { new: true }
    );
    res.json(updatedCategory);
  } catch (err: any) {
    res.status(400).send('Create update failed');
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedCategory = await Category.findOneAndDelete({
      slug: req.params.slug,
    });
    res.json(deletedCategory);
  } catch (err: any) {
    res.status(400).send('Create delete failed');
  }
};

export const getCategorySubs = (req: Request, res: Response): void => {
  return Sub.find({ parent: req.params._id }).exec((err, subs) => {
    if (err) {
      console.log(err);
      return res.status(400);
    }
    return res.json(subs);
  });
};
