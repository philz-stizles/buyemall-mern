import express from 'express';
import { signupSchema, loginSchema } from '@src/validation/yup/schemas/user.schema';
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  logoutCookie,
} from '@src/controllers/auth.controllers';
import validationRequest from '@src/validation/yup/middlewares/yup.validation.middleware';

const router = express.Router();

router.post('/signup', validationRequest(signupSchema), signup);
router.post('/create-business', validationRequest(signupSchema), signup);
router.post('/login', validationRequest(loginSchema), login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/changePassword', changePassword);
router.get('/logout', logoutCookie);

export default router;
