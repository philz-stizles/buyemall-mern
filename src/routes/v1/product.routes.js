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
import { authCheck, adminCheck } from '@src/middlewares/auth.middlewares';

const router = express.Router();

router.route('/products').post(authCheck, adminCheck, create).get(listAll);

router.post('/products/filtered', list);

router.get('/products/total').get(getProductsTotal);

router.post('/products/upload', authCheck, adminCheck, uploadFile);
router.post('/products/remove-file', authCheck, adminCheck, removeFile);

router
  .route('/products/:slug')
  .get(read)
  .put(authCheck, adminCheck, update)
  .delete(authCheck, adminCheck, remove);

router.put('/products/:productId/set-rating', authCheck, setProductRating);

router.get('/products/:productId/related', listRelatedProducts);

// router.post("/search/filters", searchFilters);

export default router;
