import express from 'express';
import {
  registerController,
  loginController,
  userController,
  productController,
} from '../controllers';
import auth from '../middlewares/auth';
import refreshController from '../controllers/auth/refreshController';

const router = express.Router();

router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.get('/me', auth, userController.me);
router.post('/refresh', refreshController.refresh);
router.post('/logout', auth, loginController.logout);

router.post('/products', productController.store);

export default router;
