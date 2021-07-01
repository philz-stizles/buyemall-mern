const authResolvers = require('./auth.resolvers');
const userResolvers = require('./user.resolvers');
const cartResolvers = require('./cart.resolvers');

const resolvers = {
  Query: {},
  Mutation: { ...authResolvers },
  ...userResolvers,
  ...cartResolvers,
};

module.exports = resolvers;
