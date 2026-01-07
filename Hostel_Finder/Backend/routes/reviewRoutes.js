const express = require('express');
const router = express.Router();
const { getHostelReviews, createReview, updateReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createReview);

router.route('/:id')
    .put(protect, updateReview)
    .delete(protect, deleteReview);

router.route('/hostel/:hostelId')
    .get(getHostelReviews);

module.exports = router;
