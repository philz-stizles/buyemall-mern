const express = require('express');
const router = express.Router();
const { create, list } = require('../controllers/orderControllers');
const { authCheck } = require('../middleware/authMiddlewares');

router.route('/orders')
  .post(authCheck, create)
  .get(authCheck, list)

module.exports = router