import express from 'express';
import {
  create,
  list,
  read,
  update,
  remove,
  setProductRating,
  listRelatedProducts,
  getProductsTotal,
  listAll,
  uploadFile,
  removeFile,
} from '@src/controllers/product.controllers';
import { authenticate, authorize } from '@src/middlewares/auth.middlewares';

const router = express.Router();

router.route('/products').post(authenticate, authorize('admin'), create).get(listAll);

router.post('/products/filtered', list);

router.get('/products/total').get(getProductsTotal);

router.post('/products/upload', authenticate, authorize('admin'), uploadFile);
router.post('/products/remove-file', authenticate, authorize('admin'), removeFile);

router
  .route('/products/:slug')
  .get(read)
  .put(authenticate, authorize('admin'), update)
  .delete(authenticate, authorize('admin'), remove);

router.put('/products/:productId/set-rating', authenticate, setProductRating);

router.get('/products/:productId/related', listRelatedProducts);

// router.post("/search/filters", searchFilters);

export default router;
