const express = require('express');
const { getHostels, getHostel, createHostel, updateHostel, deleteHostel, updateHostelStatus } = require('../controllers/hostelController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();

router.route('/').get(getHostels).post(protect, upload.array('images', 10), createHostel);
router.route('/:id').get(getHostel).put(protect, upload.array('images', 10), updateHostel).delete(protect, deleteHostel);
router.route('/:id/status').put(protect, updateHostelStatus);

module.exports = router;
