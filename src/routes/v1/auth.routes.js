const express = require('express');
const {
  signupSchema,
  loginSchema,
} = require('../../validation/yup/schemas/user.schema');
const {
  signup,
  signupWithEmailVerification,
  emailActivation,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  logoutCookie,
} = require('../../controllers/auth.controllers');
const validationRequest = require('../../validation/yup/validation.middleware');

const router = express.Router();

router.post('/signup', validationRequest(signupSchema), signup);
router.post(
  '/signup-with-email-verification',
  validationRequest(signupSchema),
  signupWithEmailVerification
);
router.post('/emailActivation', emailActivation);
router.post('/createBusiness', signup);
router.post('/login', validationRequest(loginSchema), login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/changePassword', changePassword);
router.get('/logout', logoutCookie);

module.exports = router;
