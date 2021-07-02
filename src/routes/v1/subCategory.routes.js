const express = require('express');
// middlewares
const {
  authenticate,
  authorize,
} = require('../../middlewares/auth.middlewares');
// controller
const {
  create,
  read,
  update,
  remove,
  list,
} = require('../../controllers/subCategory.controllers');

const router = express.Router();

// routes
router
  .route('/sub-categories')
  .post(authenticate, authorize('admin'), create)
  .get(list);

router
  .route('/sub-categories/:slug')
  .get(read)
  .put(authenticate, authorize('admin'), update)
  .delete(authenticate, authorize('admin'), remove);

module.exports = router;
