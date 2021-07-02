const path = require('path');
const express = require('express');
const expressRateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const swaggerUI = require('swagger-ui-express');
const mongooseConnect = require('./db/mongo');
// const { webhookCheckout } = require('./controllers/bookingControllers');
const config = require('./config');
// Routes
const authRoutes = require('./routes/v1/auth.routes');
// const userRoutes = require('./routes/v1/user.routes');
// const businessRoutes = require('./routes/v1/business.routes');
const categoryRoutes = require('./routes/v1/category.routes');
const subCategoryRoutes = require('./routes/v1/subCategory.routes');
// const productRoutes = require('./routes/v1/product.routes');
// const cartRoutes = require('./routes/v1/cart.routes');
// const orderRoutes = require('./routes/v1/order.routes');
// const couponRoutes = require('./routes/v1/coupon.routes');
// const auditRoutes = require('./routes/v1/audit.routes');
// const logRoutes = require('./routes/v1/log.routes');
// Documentation dependencies
const swaggerDocs = require('./docs');

// Initialize Server
const app = express();

//
app.enable('trust proxy');

// Database
mongooseConnect(config().dbUri);

/** Rules of our API */
// Cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // A fix for graphql response with status of 405 (Method Not Allowed)
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  return next();
});
// app.use((req, res, next): unknown => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//   );
//   res.header('Access-Control-Allow-Credentials', true);

//   if (req.method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
//     // return res.status(200).json({});
//     return res.sendStatus(200);
//   }

//   return next();
// });

// CORS
app.use(
  cors()
  // origin: 'https://someurl.com'
); // cors() is a middleware which means that you can implement on specific routes as middleware

// app.options('*', cors());
// app.options('/api/v1/tours/:id', cors()) // You can also use for specific routes

// SERVING STATIC FILES
// app.use(express.static(path.join(__dirname, 'static')))
app.use(express.static(path.join(__dirname, 'public'))); // This says, anytime there is a request from the
// server, look in the public folder e.g for http://localhost:5000/overview.html, overview should be placed
// in the root of the public folder
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
app.use(mongoSanitize()); // It will look at the req.body, req.query and req.params, and basically
// filter out all of the dollar($) signs and dots(.) in the values

// SECURITY - Data sanitization against XSS - cross site scripting
app.use(xss()); // This would clean any user input from malicious html code

// SECURITY - Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['duration', 'price'], // specify parameters that can be duplicated in the query
  })
);

// COMPRESSION
app.use(compression()); //

// DOCUMENTATION
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// RESOURCES ROUTES
app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/users', userRoutes);
// app.use('/api/v1/businesses', businessRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/subCategories', subCategoryRoutes);
// app.use('/api/v1/products', productRoutes);
// app.use('/api/v1/carts', cartRoutes);
// app.use('/api/v1/orders', orderRoutes);
// app.use('/api/v1/coupons', couponRoutes);
// app.use('/api/v1/audit', auditRoutes);
// app.use('/api/v1/log', logRoutes);

module.exports = app;
