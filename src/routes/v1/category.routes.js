import { Router } from 'express';
import {
  create,
  read,
  update,
  remove,
  list,
  getCategorySubs,
} from '@src/controllers/category.controllers';
import { authenticate } from '@src/middlewares/auth.middlewares';

const router = Router();

// Authenticate all routes after this middleware
// router.use(authenticate)

router.route('/categories').post(authenticate, create).get(list);

router.route('/categories/:slug').get(read).put(authenticate, update).delete(authenticate, remove);

router.get('/categories/:_id/subs', getCategorySubs);

export default router;
