const asyncHandler = require('express-async-handler');

// Admin middleware - checks if user is an admin
const admin = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized as admin');
    }
});

module.exports = { admin };
