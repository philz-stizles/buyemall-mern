import express from 'express';
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  logoutCookie,
} from '../controllers/authControllers';
import { loginValidator, signupValidator } from '../middlewares/validationMiddlewares';

const router = express.Router();

router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/changePassword', changePassword);
router.get('/logout', logoutCookie);

export default router;
