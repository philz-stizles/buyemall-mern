const express = require("express");
const { createPaymentIntent } = require("../controllers/stripeControllers");
const { authCheck } = require("../middleware/authMiddlewares");
const router = express.Router();

router.post('/stripe/payment-intent', authCheck, createPaymentIntent)

module.exports = router;
