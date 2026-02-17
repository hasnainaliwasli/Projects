import { Router } from 'express';
import { register, login, refreshToken, logout, getMe, getUsers, updateMe } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.get('/users', protect, getUsers);

export default router;
