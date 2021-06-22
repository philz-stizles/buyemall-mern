const express = require('express');
const { 
  addUserCart, 
  getUserCart, 
  emptyUserCart, 
  applyCouponToUserCart 
} = require('../controllers/cartControllers');
const router = express.Router()
const { authCheck } = require('../middleware/authMiddlewares')

router.route('/carts')
  .post(authCheck, addUserCart) // save cart
  .get(authCheck, getUserCart) // get cart
  .delete(authCheck, emptyUserCart); // empty cart

// Apply coupon
router.post("/carts/coupon", authCheck, applyCouponToUserCart);

module.exports = router