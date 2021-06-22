import { Schema, Types, model, Document } from 'mongoose';

interface ICartProduct {
  product: Types.ObjectId;
  count: number;
  color: string;
  price: number;
}

export interface CartDocument extends Document {
  products: ICartProduct[];
  cartTotal: number;
  totalAfterDiscount: number;
  orderedBy: Types.ObjectId;
}

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

const Cart = model<CartDocument>('Cart', cartSchema);
export default Cart;
