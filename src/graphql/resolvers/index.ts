import { IResolvers } from 'graphql-tools';
import authResolvers from '@src/graphql/resolvers/auth.resolvers';
import userResolvers from '@src/graphql/resolvers/user.resolvers';
import cartResolvers from '@src/graphql/resolvers/cart.resolvers';

const resolvers: IResolvers = {
  Query: {},
  Mutation: { ...authResolvers },
  ...userResolvers,
  ...cartResolvers,
};

export default resolvers;
