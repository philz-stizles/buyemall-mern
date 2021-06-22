const express = require("express");
const router = express.Router();
const {
  create,
  read,
  update,
  remove,
  list,
  getCategorySubs,
} = require("../controllers/categoryControllers");
const { authCheck } = require("../middleware/authMiddlewares");

// Authenticate all routes after this middleware
// router.use(authenticate)

router.route("/categories")
  .post(authCheck, create)
  .get(list);

router
  .route("/categories/:slug")
  .get(read)
  .put(authCheck, update)
  .delete(authCheck, remove);

router.get("/categories/:_id/subs", getCategorySubs);

module.exports = router;
