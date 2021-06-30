import create from './create';
import list from './list';

export default {
  paths: {
    '/subCategories': {
      ...create,
      ...list,
    },
    '/subCategories/{slug}': {},
  },
};
