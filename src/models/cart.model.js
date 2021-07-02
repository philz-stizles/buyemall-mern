const { Schema, Types, model } = require('mongoose');

const cartSchema = new Schema(
  {
    products: [
      {
        product: { type: Types.ObjectId, ref: 'Product' },
        count: Number,
        color: String,
        price: Number,
      },
    ],
    cartTotal: Number,
    totalAfterDiscount: Number,
    orderedBy: { type: Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = model('Cart', cartSchema);
