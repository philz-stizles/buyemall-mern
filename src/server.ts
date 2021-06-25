// 1. node "builtin" modules
import http from 'http';
// 2. "external" modules
import '../dotenv-config';
// 3. "internal" modules
// (if you have configured your path or webpack to handle your internal paths differently)
// 4. modules from a "parent" directory
import app, { apolloServer } from './app';
// 5. "sibling" modules from the same or a sibling's directory
// 6. "index" of the current directory
// 7. "object"-imports (only available in TypeScript)
// 8. "type" imports (only available in Flow and TypeScript)

// Configure GraphQL Subscriptions
const httpServer = http.createServer(app); // Now we have our own http instance
// unlike with express where the server was implicitly create for us
apolloServer.installSubscriptionHandlers(httpServer); // This enables a websocket
// to be used for graphql. You then need to add graphql-subscriptions

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
