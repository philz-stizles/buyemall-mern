const basicInfo = require('./basicInfo');
const servers = require('./servers');
const components = require('./components');
const tags = require('./tags');
const subCategories = require('./subCategories');

module.exports = {
  ...basicInfo,
  ...servers,
  ...components,
  ...tags,
  ...subCategories,
};
