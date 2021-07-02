const { Schema, Types, model } = require('mongoose');

const couponSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      uppercase: true,
      required: 'Name is required',
      minlength: [6, 'Too short'],
      maxlength: [12, 'Too long'],
    },
    expiry: { type: Date, required: true },
    discount: { type: Number, required: true },
    creator: {
      user: { type: Types.ObjectId, ref: 'Business' },
      business: { type: Types.ObjectId, ref: 'User' },
    },
  },
  { timestamps: true }
);

module.exports = model('Coupon', couponSchema);
