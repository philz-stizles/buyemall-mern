import path from 'path';
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
import mongooseConnect from './db/index';
import AppError from './utils/appError';
// import errorControllers from './controllers/errorController';
// import { webhookCheckout } from './controllers/bookingControllers';
import authRoutes from './routes/authRoutes';

// Initialize Server
const app: Express = express();

//
app.enable('trust proxy');

// Database
mongooseConnect(process.env.MONGODB_LOCAL_URI as string);

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
// app.use('/api/v1/users', require('./routes/userRoutes'));
// app.use('/api/v1/tours', require('./routes/tourRoutes'));
// app.use('/api/v1/reviews', require('./routes/reviewRoutes'));
// app.use('/api/v1/bookings', require('./routes/bookingRoutes'));

// Handle unhandled routes - routes that are not caught by our routers
// Pass Error to the global error handler middleware
app.all('*', (req, res, next) => {
  const error = new AppError(`Can't find ${req.originalUrl} on this server`, 404);

  next(error);
});

// Global error handling
// app.use(errorControllers.handleGlobalErrors);

export default app;
