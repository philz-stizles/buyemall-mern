import basicInfo from './basicInfo';
import servers from './servers';
import components from './components';
import tags from './tags';
import subCategories from './subCategories';
import categories from './categories';

export default {
  ...basicInfo,
  ...servers,
  ...components,
  ...tags,
  paths: {
    ...subCategories,
    ...categories,
  },
};
