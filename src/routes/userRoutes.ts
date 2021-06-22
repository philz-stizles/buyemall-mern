import express from 'express';
import {
  createOrUpdate,
  getCurrentUser,
  saveUserAddress,
  addToWishlist,
  removeFromWishlist,
  wishlist,
  getAllOrders,
  updateOrderStatus,
  getMe,
  updateMe,
  deleteMe,
  getAllUsers,
  updateUser,
  deleteUser,
  getUser,
  createUser,
} from '@src/controllers/userControllers';
import { authenticate, authorize } from '@src/middlewares/authMiddlewares';
import { changePassword } from '@src/controllers/authControllers';
import { resizeUserPhoto, uploadUserPhoto } from '@src/middlewares/multerMiddlewares';

const router = express.Router();

router.post('/users/create-or-update', authenticate, createOrUpdate);

router.get('/users/current-user', authenticate, getCurrentUser);
router.get('/users/current-admin', authenticate, authorize('admin'), getCurrentUser);

// Admin routes
router.get('/admin/orders', authenticate, authorize('admin'), getAllOrders);
router.put('/admin/order-status', authenticate, authorize('admin'), updateOrderStatus);

// Authenticate all routes after this middleware
router.use(authenticate);

// Manage profile
router.route('/me').get(getMe).patch(uploadUserPhoto, resizeUserPhoto, updateMe).delete(deleteMe);
router.patch('/me/changePassword', changePassword);

// Save address
router.post('/me/address', saveUserAddress);

// Manage wish-list
router.route('/me/wishlist').post(addToWishlist).get(wishlist);
router.route('/me/wishlist/:productId').put(removeFromWishlist);

// Authorize only admin for all routes after this middleware
router.use(authorize('admin'));

router.route('/').post(createUser).get(getAllUsers);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
