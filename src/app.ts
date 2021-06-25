import path from 'path';
import fs from 'fs';
import express, { Express, Request, Response } from 'express';
import expressRateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
// import xss from 'xss';
// import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { ApolloServer, gql } from 'apollo-server-express';
import mongooseConnect from './db/index';
import AppError from './utils/appError';
// import errorControllers from './controllers/errorController';
// import { webhookCheckout } from './controllers/bookingControllers';
import config from './config';
// Routes
import authRoutes from '@src/routes/v1/auth.routes';
import userRoutes from '@src/routes/v1/user.routes';
import businessRoutes from '@src/routes/v1/business.routes';
import subCategoryRoutes from '@src/routes/v1/subCategory.routes';
import categoryRoutes from '@src/routes/v1/category.routes';
import productRoutes from '@src/routes/v1/product.routes';
import cartRoutes from '@src/routes/v1/cart.routes';
import orderRoutes from '@src/routes/v1/order.routes';
import couponRoutes from '@src/routes/v1/coupon.routes';
import auditRoutes from '@src/routes/v1/audit.routes';
import logRoutes from '@src/routes/v1/log.routes';
// GraphQL dependencies
import resolvers from '@src/graphql/resolvers';
import formatError from '@src/graphql/error';
import context from '@src/graphql/context';
import dataSources from '@src/graphql/dataSources/mongodb';

// Initialize Server
const app: Express = express();

//
app.enable('trust proxy');

// Database
mongooseConnect(config().dbUri);

/** Rules of our API */
app.use((req, res, next): unknown => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    // return res.status(200).json({});
    return res.sendStatus(200);
  }

  return next();
});

// CORS
app.use(
  cors({
    // origin: 'https://someurl.com'
  })
); // cors() is a middleware which means that you can implement on specific routes as middlware

// app.options('*', cors());
// app.options('/api/v1/tours/:id', cors()) // You can also use for specific routes

// SERVING STATIC FILES
// app.use(express.static(path.join(__dirname, 'static')))
app.use(express.static(path.join(__dirname, 'public'))); // This says, anytime there is a request from the
// server, look in the public folder e.g for http://localhost:5000/overview.html, overview should be placed
// in the root of the publis folder
app.use(express.static(path.join(__dirname, 'uploads')));

// SECURITY - Anti Cross-site Scripting - Security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// LOGGING - DEVELOPMENT
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// SECURITY - Anti Brute Force Attacks - Set rate limiting
app.use(
  '/api',
  expressRateLimit({
    // By specifying api, this would then affect all the routes since they all have /api
    max: 100, // no of requests per IP
    windowMs: 60 * 60 * 1000, // per period(1 hr)
    message: {
      status: 429,
      message: 'Too many requests from this IP, please try again in an hour',
    },
  })
);

// STRIPE CHECKOUT WEBHOOK
// When we needs this body in a raw form
// app.post('/webhook-checkout', express.raw({ type: 'application/json' }), webhookCheckout);

// REQUEST BODY PARSING
app.use(express.json({ limit: '10kb' })); // This would limit the body size to 10kb
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // This would limit the body size to 10kb
app.use(cookieParser()); // Parses data from cookies

// SECURITY - Data sanitization against NoSQL query injection
// app.use(mongoSanitize()); // It will look at the req.body, req.query and req.params, and basically
// filter out all of the dollar($) signs and dots(.) in the values

// SECURITY - Data sanitization against XSS - cross site scripting
// app.use(xss()); // This would clean any user input from malicious html code

// SECURITY - Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['duration', 'price'], // specify parameters that can be duplicated in the query
  })
);

// COMPRESSION
app.use(compression()); //

// TESTING MIDDLEWARE
app.use((req: Request, res: Response, next) => {
  // console.log(req.cookies)
  next();
});

// RESOURCES ROUTES
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/businesses', businessRoutes);
app.use('/api/v1/subCategories', subCategoryRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/carts', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/audit', auditRoutes);
app.use('/api/v1/log', logRoutes);

// Configure GraphQL Apollo Server
// If your server is deployed to an environment where NODE_ENV is set to production,
// GraphQL Playground and introspection are disabled by default. To enable them,
// set playground: true and introspection: true
// https://studio.apollographql.com/sandbox/explorer
export const apolloServer = new ApolloServer({
  typeDefs: gql(
    fs.readFileSync(path.join(__dirname, 'graphql', 'typeDefs.graphql'), { encoding: 'utf8' })
  ),
  resolvers,
  context,
  formatError, // Error formatting
  dataSources, // DataSource - MongoDB
});
apolloServer.applyMiddleware({ app, path: '/graphql' });

// Handle unhandled routes - routes that are not caught by our routers
// Pass Error to the global error handler middleware
app.all('*', (req, res, next) => {
  const error = new AppError(`Can't find ${req.originalUrl} on this server`, 404);

  next(error);
});

// Global error handling
// app.use(errorControllers.handleGlobalErrors);

export default app;