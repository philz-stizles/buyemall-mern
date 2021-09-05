import fs from 'fs';
import path from 'path';
import { Server } from 'http';
import { Express } from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
// GraphQL dependencies
import resolvers from '@src/graphql/resolvers';
import formatError from '@src/graphql/error';
import context from '@src/graphql/context';

const initGraphQL = (app: Express, server: Server): void => {
  // import dataSources from '@src/graphql/dataSources/mongodb';
  // Configure GraphQL Apollo Server
  // If your server is deployed to an environment where NODE_ENV is set to production,
  // GraphQL Playground and introspection are disabled by default. To enable them,
  // set playground: true and introspection: true
  // https://studio.apollographql.com/sandbox/explorer
  const apolloServer = new ApolloServer({
    typeDefs: gql(
      fs.readFileSync(path.join(__dirname, 'graphql', 'typeDefs.graphql'), {
        encoding: 'utf8',
      })
    ),
    resolvers,
    context,
    formatError, // Error formatting
    // dataSources, // DataSource - MongoDB
    introspection: true,
    playground:
      process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test',
  });
  apolloServer.applyMiddleware({ app, path: '/graphql' });
  // Configure GraphQL Subscriptions
  apolloServer.installSubscriptionHandlers(server); // This enables a websocket
  // to be used for graphql. You then need to add graphql-subscriptions
};

export default initGraphQL;
