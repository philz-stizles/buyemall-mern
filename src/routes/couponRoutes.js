const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middleware/authMiddlewares");

// controller
const { create, remove, list } = require("../controllers/couponControllers");

// routes
router.route("/coupons")
  .post(authCheck, adminCheck, create)
  .get(list);

router.delete("/coupons/:couponId", authCheck, adminCheck, remove);

module.exports = router;
