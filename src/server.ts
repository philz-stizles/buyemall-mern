// 1. node "builtin" modules
// 2. "external" modules
import '../dotenv-config';
// 3. "internal" modules
// (if you have configured your path or webpack to handle your internal paths differently)
// 4. modules from a "parent" directory
import app from './app';
// 5. "sibling" modules from the same or a sibling's directory
// 6. "index" of the current directory
// 7. "object"-imports (only available in TypeScript)
// 8. "type" imports (only available in Flow and TypeScript)

console.log('port', process.env.PORT);
const PORT: number = parseInt(process.env.PORT as string, 10);

const server = app.listen(PORT, () => {
  // if (err) {
  //   console.log(`Server running on ${PORT}`);
  // }

  console.log(`Server running on ${PORT} ${process.env.NODE_ENV}`);
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
