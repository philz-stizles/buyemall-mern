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
import '../dotenv-config';
import app from './app';
import connectDB from './db/index';
import { seedPermissions, seedRoles } from '@src/db/seeder';
import config from './config';
import initSocketIO from './socket';
import initGraphQL from './graphql';

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

  // Connect to database.
  await connectDB(config().dbUri);

  // Seed permissions.
  await seedPermissions();

  // Seed roles.
  await seedRoles();

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
    console.log(`🚀 API Docs @ http://localhost:${PORT}/api-docs`);
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
