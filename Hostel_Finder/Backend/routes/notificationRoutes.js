const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getNotifications,
    markAsRead,
    markAllAsRead,
    clearNotifications
} = require('../controllers/notificationController');

router.use(protect); // All routes are protected

router.get('/', getNotifications);
router.delete('/', clearNotifications);
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllAsRead);

module.exports = router;
