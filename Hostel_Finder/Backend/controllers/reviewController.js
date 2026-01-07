const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Hostel = require('../models/Hostel');
const { createNotification } = require('./notificationController');

// @desc    Get reviews for a hostel
// @route   GET /api/reviews/hostel/:hostelId
// @access  Public
const getHostelReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ hostel: req.params.hostelId });

    res.status(200).json(reviews);
});

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
    const { hostelId, rating, comment } = req.body;

    const hostel = await Hostel.findById(hostelId);

    if (!hostel) {
        res.status(404);
        throw new Error('Hostel not found');
    }

    // Check if already reviewed (optional enforcement)
    // const alreadyReviewed = await Review.findOne({ hostel: hostelId, user: req.user.id });
    // if (alreadyReviewed) { res.status(400); throw new Error('You have already reviewed this hostel'); }

    const review = await Review.create({
        hostel: hostelId,
        user: req.user.id,
        userName: req.user.fullName,
        userImage: req.user.profileImage,
        rating: Number(rating),
        comment
    });

    // Notify Hostel Owner
    await createNotification({
        recipient: hostel.owner,
        sender: req.user.id,
        type: 'NEW_REVIEW',
        title: 'New Review',
        message: `${req.user.fullName} reviewed your hostel "${hostel.name}"`,
        relatedId: review._id,
        relatedModel: 'Review'
    });

    res.status(201).json(review);
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        res.status(404);
        throw new Error('Review not found');
    }

    // Only allow user to update their own review or admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized');
    }

    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;
    // Update user info to keep it current only if owner updates, keep original otherwise
    if (review.user.toString() === req.user.id) {
        review.userName = req.user.fullName;
        review.userImage = req.user.profileImage;
    }

    const updatedReview = await review.save();

    res.json(updatedReview);
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        res.status(404);
        throw new Error('Review not found');
    }

    // Only allow user to delete their own review or admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized');
    }

    await review.deleteOne();

    res.json({ message: 'Review removed' });
});

module.exports = {
    getHostelReviews,
    createReview,
    updateReview,
    deleteReview
};
