import authResolvers from '@src/graphql/resolvers/auth.resolvers';
import userResolvers from '@src/graphql/resolvers/user.resolvers';
import cartResolvers from '@src/graphql/resolvers/cart.resolvers';

export default { ...authResolvers, ...userResolvers, ...cartResolvers };
