const create = require('./create');
const list = require('./list');

module.exports = {
  paths: {
    '/subCategories': {
      ...create,
      ...list,
    },
    '/subCategories/{slug}': {},
  },
};
