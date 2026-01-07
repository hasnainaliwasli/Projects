const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ recipient: req.user.id })
        .sort({ createdAt: -1 })
        .limit(50); // Limit to last 50 notifications

    const unreadCount = await Notification.countDocuments({
        recipient: req.user.id,
        isRead: false
    });

    res.status(200).json({
        notifications,
        unreadCount
    });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }

    // Check ownership
    if (notification.recipient.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json(notification);
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { recipient: req.user.id, isRead: false },
        { $set: { isRead: true } }
    );

    res.status(200).json({ message: 'All notifications marked as read' });
});

// @desc    Clear all notifications
// @route   DELETE /api/notifications
// @access  Private
const clearNotifications = asyncHandler(async (req, res) => {
    await Notification.deleteMany({ recipient: req.user.id });
    res.status(200).json({ message: 'Notifications cleared' });
});

// Internal helper to create notification
const createNotification = async ({ recipient, sender, type, title, message, relatedId, relatedModel }) => {
    try {
        await Notification.create({
            recipient,
            sender,
            type,
            title,
            message,
            relatedId,
            relatedModel
        });
    } catch (error) {
        console.error('Notification creation failed:', error);
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    createNotification
};
