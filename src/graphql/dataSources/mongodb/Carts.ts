import { MongoDataSource } from 'apollo-datasource-mongodb';
import { ObjectId } from 'mongodb';
import { CartDocument } from '@src/models/cart.model';

export default class Carts extends MongoDataSource<CartDocument> {
  getCart(cartId: ObjectId): Promise<CartDocument | null | undefined> {
    return this.findOneById(cartId);
  }
}
