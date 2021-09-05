// 1. node "builtin" modules
// 2. "external" modules
// 3. "internal" modules
// (if you have configured your path or webpack to handle your internal paths differently)
// 4. modules from a "parent" directory
// 5. "sibling" modules from the same or a sibling's directory
// 6. "index" of the current directory
// 7. "object"-imports (only available in TypeScript)
// 8. "type" imports (only available in Flow and TypeScript)
import { Express } from 'express';
import http from 'http';
import swaggerUI from 'swagger-ui-express';
import '../dotenv-config';
import AppError from './errors/app.error';
import app from './app';
import connectDB from './db/index';
import config from './config';
// Documentation dependencies
// import specs from './documentation/swagger.jsdoc';
import swaggerDocument from './docs';
import initSocketIO from './socket';
import initGraphQL from './graphql';

// DOCUMENTATION
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

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
// app.use(errorControllers.handleGlobalErrors);

const startUp = async (expressApp: Express) => {
  if (!process.env.JWT_AUTH_SECRET) {
    throw new Error('JWT_AUTH_SECRET must be defined');
  }

  if (!config().dbUri) {
    throw new Error('DATABASE_URI must be defined');
  }

  if (!process.env.PORT) {
    throw new Error('PORT must be defined');
  }

  // Connect to database
  console.log(config().dbUri);
  await connectDB(config().dbUri);

  // initialize http server
  const httpServer = http.createServer(expressApp); // Now we have our own http instance
  // unlike with express where the server was implicitly create for us

  // Initialize GraphQL
  initGraphQL(expressApp, httpServer);

  // Initialize Socket.io
  initSocketIO(httpServer);

  const PORT: number = parseInt(process.env.PORT as string, 10);
  const server = httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on ${PORT} ${process.env.NODE_ENV}`);
  });

  process.on('unhandledRejection', (err?: Error) => {
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
};

startUp(app);
