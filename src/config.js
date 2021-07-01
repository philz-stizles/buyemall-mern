const config = () => {
  let dbUri = process.env.MONGODB_DEV_URI;

  if (process.env.NODE_ENV === 'production') {
    dbUri = process.env.MONGODB_CLOUD_URI;
  } else if (process.env.NODE_ENV === 'test') {
    dbUri = process.env.MONGODB_TEST_URI;
  } else {
    dbUri = process.env.MONGODB_DEV_URI;
  }

  return { dbUri };
};

module.exports = config;
