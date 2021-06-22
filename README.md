# E-COMMERCE BACKEND RESOURCES

## Introduction

This is an e-commerce back end resource that enables users to signup and purchase items

## Technologies

- Node, Express,
- Typescript, Eslint
- Jest, Istanbul
- AWS SES, S3, EC2
- Cloudinary
- MongoDB, Redis
- Docker

## Features

- Multitenancy
- Authentication, Authorization
- Crone jobs, and schedulers
- Testing and coveralls

## Configure Typescript

- Install packages: npm install -D typescript ts-node @types/node @types/express
- Create tsconfig file: npx tsc --init

## Configure Eslint

- Install vscode eslint plugin
- Recommendation to install eslint on a local level: npm install -D eslint
- Configure eslint: npx eslint -init

  - To check syntax, find problems, and enforce code style
  - JavaScript modules (import/export)
  - Which framework does your project use? None of these
  - Does your project use TypeScript? » Yes
  - Where does your code run? Node
  - How would you like to define a style for your project?
    Use a popular style guide
    Airbnb: https://github.com/airbnb/javascript
  - What format do you want your config file to be in? JavaScript
  - Would you like to install them now with npm? » Yes

- Create .eslintignore file: touch .eslintignore
  add:
  node_modules
  dist
  coverage

- Install import resolver(optional): npm install -D eslint-import-resolver-typescript tsconfig-paths
- Reload vscode for configurations to kick in: ctrl + shift + p > reload

## Configure Prettier

- Install vscode eslint plugin
- Install prettier in project: npm install -D prettier

  {
  "semi": true,
  "tabWidth": 2,
  "printWidth": 120,
  "singleQuote": true,
  "trailingComma": "es5",
  "arrowParens": "avoid",
  "jsxBracketSameLine": true
  }

- Install prettier eslint plugins: npm install -D eslint-config-prettier eslint-plugin-prettier

## Jest

- Install dependencies: npm install -D jest ts-jest @types/jest
- Configure eslint: npx ts-jest config:init
- Add your configs to 'jest.config.js'
- Configure '.eslintrc.js':
  env: {
  ...
  jest: true,
  },
- Configure 'package.json'
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",

## Environment Variables

- install packages
  npm i dotenv-safe
  npm i --save-dev @types/dotenv-safe
- Create files '.env.example' and '.env'

npm i --save-dev @types/morgan @types/hpp

- -JWT_EXPIRES_IN=90d # 30s | 5m | 5h | 1d
  xss-clean
  create folder '@types'
  Add "../@types" to tsconfig.json's typeRoots attribute along with "../node_modules/@types" if it is not already there
  .d.ts declare module 'xss-clean';

  express-mongo-sanitize
  @types/express-mongo-sanitize

  express-rate-limit
  @types/express-rate-limit

  helmet

  cors
  @types/cors

  compression
  @types/compression

nodemailer

// Put as much business logic in the models to keep the controllers as simple and lean as possible, so that controllers can focus on handling requests and interacting with models and send responses

// Configure Eslint & Prettier: npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-markdown
//
//
//
// SECURITY ISSUES AND BEST PRACTISES
// Compromised Database
// - Strongly encrypt passwords with salt and hash (bcrypt)
// - Strongly encrypt password reset tokens (SHA 256)
//
// Brute Force Attacks
// - Use bcrypt to make login requests slow
// - Implement rate limiting(npm install express-rate-limit) which limits the no of requests from on single IP
// - Implement max login attampts
//
// Cross-site Scripting Attacks
// - Store JWT in HTTPOnly cookies
// - SAanitize user input data
// - Set special HTTP headers(helmet)
//
// Cross-site Scripting Attacks - This attack allows the attacker to read the localStorage which is the reason we should never store token in localstorage
// - Store JWT in HTTPOnly cookies
// - SAanitize user input data
// - Set special HTTP headers(helmet)
//
// Sanitization
// - xss-clean
// - express-mongo-sanitize

// FILE UPLOADS

- multer - for parsing, validation etc
- sharp - for resizing

DATA MODELLING
This is the process of converting unstructured data from real-world scenarios into structured, logical data models

// BUNDLING MVC JS FILES
parcel - npm install --save-dev parcel-bundler
package.json
"scripts": {
...,
"watch:js": "parcel watch ./public/js/index.js --out-dir ./public/js --out-file bundle.js"
},

// TESTING
npm install --save-dev jest

jest --watchAll

npm run test

// DEPLOYMENT

// CHALLENGES => TODO
// Users can only review a tour that they have actually booked
