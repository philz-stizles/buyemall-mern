import { MongoDataSource } from 'apollo-datasource-mongodb';
import { Types } from 'mongoose';
import { CartDocument } from '@src/models/cart.model';

export default class Carts extends MongoDataSource<CartDocument> {
  getCart(cartId: Types.ObjectId): Promise<CartDocument | null | undefined> {
    return this.findOneById(cartId);
  }
}
