import Stripe from 'stripe';
import { Request, Response } from 'express';
import User, { UserDocument } from '@src/models/userModel';
import Cart, { CartDocument } from '@src/models/cartModel';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2020-08-27',
});

exports.createPaymentIntent = async (req: Request, res: Response) => {
  const { isCouponApplied } = req.body;

  // Get user to retrieve user._id from DB, firebase auth middleware may not have
  // the users db _id
  const user: UserDocument | null = await User.findOne({ email: req.user.email }).exec();

  // 2 get user cart total
  const cart: CartDocument | null = await Cart.findOne({
    orderedBy: user?._id,
  }).exec();

  if (!cart) {
    return res.status(400).send({});
  }

  let finalAmount = 0;
  const { totalAfterDiscount, cartTotal } = cart;
  if (isCouponApplied && totalAfterDiscount) {
    finalAmount = totalAfterDiscount * 100;
  } else {
    finalAmount = cartTotal * 100;
  }

  // create payment intent with order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: finalAmount,
    currency: 'usd',
  });

  console.log(paymentIntent);

  return res.send({
    clientSecret: paymentIntent.client_secret,
    cartTotal,
    totalAfterDiscount,
    payable: finalAmount,
  });
};
