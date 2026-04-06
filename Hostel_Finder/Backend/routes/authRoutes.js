const express = require('express');
const { rateLimit } = require('express-rate-limit');
const { registerUser, loginUser, getMe, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();

// Stricter rate limit for Login and Forgot Password: 5 requests per 15 minutes
const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
        message: "Too many login/password reset attempts. Please try again after 15 minutes."
    }
});

router.post('/register', upload.single('profileImage'), registerUser);
router.post('/login', authLimiter, loginUser);
router.get('/me', protect, getMe);
router.post('/forgotpassword', authLimiter, forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);

module.exports = router;
