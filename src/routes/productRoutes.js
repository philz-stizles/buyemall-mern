const express = require('express')
const router = express.Router()
const {
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
} = require("../controllers/productControllers");
const { authCheck, adminCheck } = require('../middleware/authMiddlewares');

router.route('/products')
  .post(authCheck, adminCheck, create)
  .get(listAll)

router.post("/products/filtered", list);

router.get('/products/total').get(getProductsTotal)
  
router.post("/products/upload", authCheck, adminCheck, uploadFile);
router.post("/products/remove-file", authCheck, adminCheck, removeFile);

router.route('/products/:slug')
  .get(read)
  .put(authCheck, adminCheck, update)
  .delete(authCheck, adminCheck, remove)

router.put("/products/:productId/set-rating", authCheck, setProductRating);

router.get("/products/:productId/related", listRelatedProducts);

// router.post("/search/filters", searchFilters);

module.exports = router