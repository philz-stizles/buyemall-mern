import catchAsync from '../utils/catchAsync';
import AppError from '../utils/app.error';
import { APIFeatures } from '../utils/api.utils';

export const createOne = Model =>
  catchAsync(async (req, res) => {
    const newModel = await Model.create(req.body);

    res
      .status(201)
      .json({ status: true, data: newModel, message: 'created successfully' });
  });

export const getOne = (Model, populate) =>
  catchAsync(async (req, res, next) => {
    const query = Model.findById(req.params.id);

    if (populate) {
      query.populate(populate);
    }

    const existingModel = await query;

    if (!existingModel)
      return next(new AppError('Resource does not exist', 404));

    return res.json({
      status: true,
      data: existingModel,
      message: 'retrieved successfully',
    });
  });

export const getAll = Model =>
  catchAsync(async (req, res) => {
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const models = await features.query;

    res.json({
      status: true,
      data: {
        items: models,
        count: models.length,
      },
      message: 'retrieved successfully',
    });
  });

export const deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) return next(new AppError('Resource does not exist', 404));

    return res
      .status(204)
      .json({ status: true, data: null, message: 'Deleted successfully' });
  });

export const updateOne = Model =>
  catchAsync(async (req, res, next) => {
    console.log(req.body);
    const updatedModel = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedModel)
      return next(new AppError('Resource does not exist', 404));

    return res.json({
      status: true,
      data: updatedModel,
      message: 'Updated successfully',
    });
  });
