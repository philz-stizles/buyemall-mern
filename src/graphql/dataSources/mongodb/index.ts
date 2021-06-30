import { MongoClient } from 'mongodb';
import Users from '@src/graphql/dataSources/mongodb/Users';
import Carts from '@src/graphql/dataSources/mongodb/Carts';

type MongoDataSources = {
  users: Users;
  carts: Carts;
};

export default (): MongoDataSources => {
  const client = new MongoClient('mongodb://localhost:27017/test');
  client.connect();

  return {
    users: new Users(client.db().collection('users')),
    carts: new Carts(client.db().collection('carts')),
  };
};
