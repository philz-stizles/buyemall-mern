const fs = require('fs');
const path = require('path');
const http = require('http');
const { ApolloServer, gql } = require('apollo-server-express');
require('./dotenv-config');
const AppError = require('./utils/app.error');
const app = require('./app');
// GraphQL dependencies
const resolvers = require('./graphql/resolvers');
const formatError = require('./graphql/error');
const context = require('./graphql/context');
const { errorHandler } = require('./middlewares/error.middleware');
// import dataSources from '@src/graphql/dataSources/mongodb');

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

// Handle unhandled routes - routes that are not caught by our routers
// Pass Error to the global error handler middleware
app.all('*', (req, res, next) => {
  const error = new AppError(
    `Can't find ${req.originalUrl} on this server`,
    404
  );

  next(error);
});

// Global error handling
app.use(errorHandler);

// Configure GraphQL Subscriptions
const httpServer = http.createServer(app); // Now we have our own http instance
// unlike with express where the server was implicitly create for us
apolloServer.installSubscriptionHandlers(httpServer); // This enables a websocket
// to be used for graphql. You then need to add graphql-subscriptions

const PORT = parseInt(process.env.PORT, 10);

const server = httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT} ${process.env.NODE_ENV}`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err?.name, err?.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down gracefully...');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
