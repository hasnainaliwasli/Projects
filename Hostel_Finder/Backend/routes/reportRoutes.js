const express = require('express');
const router = express.Router();
const {
    createReport,
    getAllReports,
    getUserReports,
    updateReportStatus,
    deleteReport
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Private route to submit report
router.post('/', protect, createReport);

// User reports
router.get('/my-reports', protect, getUserReports);

// Admin routes
router.get('/', protect, admin, getAllReports);
router.patch('/:id/status', protect, admin, updateReportStatus);
router.delete('/:id', protect, admin, deleteReport);

module.exports = router;
