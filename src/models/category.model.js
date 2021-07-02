const { Schema, model, Types } = require('mongoose');

const categorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: 'Name is required',
      minlength: [2, 'Too short'],
      maxlength: [32, 'Too long'],
    },
    description: {
      type: String,
      trim: true,
      minlength: [2, 'Too short'],
      maxlength: [32, 'Too long'],
    },
    slug: { type: String, unique: true, lowercase: true, index: true },
    isPublished: { type: Boolean, default: false, required: true },
    creator: { type: Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = model('Category', categorySchema);
