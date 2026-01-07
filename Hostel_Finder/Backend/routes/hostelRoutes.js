const express = require('express');
const router = express.Router();
const { getHostels, getHostel, createHostel, updateHostel, deleteHostel, updateHostelStatus } = require('../controllers/hostelController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getHostels).post(protect, createHostel);
router.route('/:id').get(getHostel).put(protect, updateHostel).delete(protect, deleteHostel);
router.route('/:id/status').put(protect, updateHostelStatus);

module.exports = router;
