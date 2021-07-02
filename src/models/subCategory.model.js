const { Schema, Types, model } = require('mongoose');

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: 'Name is required',
      minlength: [2, 'Too short'],
      maxlength: [32, 'Too long'],
    },
    slug: { type: String, unique: true, lowercase: true, index: true },
    category: { type: Types.ObjectId, ref: 'Category', required: true },
    creator: { type: Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = model('SubCategory', subCategorySchema);
