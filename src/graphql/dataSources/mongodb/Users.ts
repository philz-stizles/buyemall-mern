import { MongoDataSource } from 'apollo-datasource-mongodb';
import { ObjectId } from 'mongodb';
import { IUserDocument } from '@src/graphql/interfaces';
import { IContext } from '@src/graphql/context';

export default class Users extends MongoDataSource<IUserDocument, IContext> {
  getUser(userId: ObjectId): Promise<IUserDocument | null | undefined> {
    return this.findOneById(userId);
  }
}
