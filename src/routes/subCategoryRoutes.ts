const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middleware/authMiddlewares");

// controller
const { create, read, update, remove, list } = require("../controllers/subCategoryControllers");

// routes
router.route('/sub-categories')
  .post(authCheck, adminCheck, create)
  .get(list);

router.route('/sub-categories/:slug')
  .get(read)
  .put(authCheck, adminCheck, update)
  .delete(authCheck, adminCheck, remove);

module.exports = router;
