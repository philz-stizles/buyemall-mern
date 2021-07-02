const { Schema, Types, model } = require('mongoose');

const orderSchema = new Schema(
  {
    products: [
      {
        product: { type: Types.ObjectId, ref: 'Product' },
        count: Number,
        color: String,
      },
    ],
    paymentIntent: {},
    status: {
      type: String,
      default: 'Not Processed',
      enum: [
        'Not Processed',
        'processing',
        'Dispatched',
        'Cancelled',
        'Completed',
      ],
    },
    orderedBy: { type: Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = model('Order', orderSchema);
