const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const BlockedUser = require('../models/BlockedUser');

const toggleFavorite = asyncHandler(async (req, res) => {
    const hostelId = req.params.id;

    if (!hostelId) {
        res.status(400);
        throw new Error('Hostel ID is required');
    }

    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Check if already in favorites
    if (user.favoriteHostels.includes(hostelId)) {
        // Remove
        user.favoriteHostels = user.favoriteHostels.filter(id => id.toString() !== hostelId);
    } else {
        // Add
        user.favoriteHostels.push(hostelId);
    }

    await user.save();

    res.status(200).json(user.favoriteHostels);
});

const getFavorites = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).populate('favoriteHostels');

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.status(200).json(user.favoriteHostels);
});

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Only allow user to update their own profile
    if (user._id.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized');
    }

    // Update fields
    user.fullName = req.body.fullName || user.fullName;
    user.email = req.body.email || user.email;
    user.phoneNumbers = req.body.phoneNumbers || user.phoneNumbers;
    user.homeAddress = req.body.homeAddress || user.homeAddress;
    user.profileImage = req.body.profileImage || user.profileImage;

    const updatedUser = await user.save();

    res.json({
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage,
        phoneNumbers: updatedUser.phoneNumbers,
        homeAddress: updatedUser.homeAddress,
        favoriteHostels: updatedUser.favoriteHostels
    });
});

// @desc    Delete user account
// @route   DELETE /api/users/:id
// @access  Private
// @desc    Archive user account (Soft Delete)
// @route   DELETE /api/users/:id
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    const { deleteData } = req.body; // Boolean flag to delete associated data

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Only allow user to delete their own account OR admin can delete any user
    if (user._id.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized');
    }

    // If deleteData is true, remove hostels and reviews
    if (deleteData) {
        const Hostel = require('../models/Hostel');
        await Hostel.deleteMany({ owner: user._id });

        const Review = require('../models/Review');
        await Review.deleteMany({ user: user._id });
    }

    // Permanently delete the user from the database
    await user.deleteOne();

    res.json({ message: 'Account deleted successfully' });
});

// @desc    Get archived users
// @route   GET /api/users/archived
// @access  Private/Admin
// @route   PUT /api/users/restore/:id
// @access  Private/Admin
const restoreUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.isArchived = false;
        user.archivedAt = undefined;
        await user.save();
        res.json({ message: 'User restored successfully' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

const getArchivedUsers = asyncHandler(async (req, res) => {
    const users = await User.find({ isArchived: true }).select('-password');
    res.json(users);
});

// @desc    Permanently delete user
// @route   DELETE /api/users/permanent/:id
// @access  Private/Admin
const permanentDeleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Cascade delete: Remove all hostels owned by this user
    const Hostel = require('../models/Hostel');
    await Hostel.deleteMany({ owner: user._id });

    // Cascade delete: Remove all reviews by this user
    const Review = require('../models/Review');
    await Review.deleteMany({ user: user._id });

    await user.deleteOne();

    res.json({ message: 'User permanently deleted' });
});

// @desc    Block a user
// @route   POST /api/users/block
// @access  Private/Admin
const blockUser = asyncHandler(async (req, res) => {
    const { email, reason } = req.body;

    if (!email) {
        res.status(400);
        throw new Error('Email is required');
    }

    const alreadyBlocked = await BlockedUser.findOne({ email });

    if (alreadyBlocked) {
        res.status(400);
        throw new Error('User is already blocked');
    }

    const newBlockedUser = await BlockedUser.create({
        email,
        reason,
        blockedBy: req.user.id
    });

    // Emit socket event to disconnect user immediately
    const User = require('../models/User');
    const userToBlock = await User.findOne({ email });

    if (userToBlock) {
        const io = req.app.get('socketio');
        io.in(userToBlock._id.toString()).emit("user blocked");
    }

    res.status(201).json({ message: 'User blocked successfully' });
});

// @desc    Unblock a user
// @route   DELETE /api/users/block/:id
// @access  Private/Admin
const unblockUser = asyncHandler(async (req, res) => {
    // Check if ID is a mongo ID or email
    // But route param :id suggests ID. Let's support ID first.
    // Frontend could pass the BlockedUser ID.

    const blocked = await BlockedUser.findById(req.params.id);

    if (blocked) {
        await blocked.deleteOne();
        res.json({ message: 'User unblocked successfully' });
    } else {
        res.status(404);
        throw new Error('Blocked user not found');
    }
});

// @desc    Get all blocked users
// @route   GET /api/users/block
// @access  Private/Admin
const getBlockedUsers = asyncHandler(async (req, res) => {
    const blockedUsers = await BlockedUser.find({}).sort({ createdAt: -1 });
    res.json(blockedUsers);
});

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({
        $or: [{ isArchived: false }, { isArchived: { $exists: false } }]
    }).select('-password');
    res.json(users);
});

// @desc    Upload profile image
// @route   POST /api/users/profile-image
// @access  Private
const uploadProfileImage = asyncHandler(async (req, res) => {
    const { image } = req.body;

    if (!image) {
        res.status(400);
        throw new Error('No image provided');
    }

    // Validate Base64 format
    const matches = image.match(/^data:image\/(jpeg|jpg|png|webp);base64,/);
    if (!matches) {
        res.status(400);
        throw new Error('Invalid image format. Only JPEG, PNG, and WebP are allowed.');
    }

    // Check file size (Base64 is ~33% larger than original)
    // Max 2MB original = ~2.67MB Base64
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const sizeInBytes = Buffer.from(base64Data, 'base64').length;
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (sizeInBytes > maxSize) {
        res.status(400);
        throw new Error('Image size must be less than 2MB');
    }

    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.profileImage = image;
    await user.save();

    res.json({
        message: 'Profile image uploaded successfully',
        profileImage: user.profileImage
    });
});

// @desc    Delete profile image
// @route   DELETE /api/users/profile-image
// @access  Private
const deleteProfileImage = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Reset to default avatar
    user.profileImage = 'https://cdn-icons-png.flaticon.com/512/9203/9203764.png';
    await user.save();

    res.json({
        message: 'Profile image deleted successfully',
        profileImage: user.profileImage
    });
});

module.exports = {
    toggleFavorite,
    getFavorites,
    updateUser,
    deleteUser,
    getAllUsers,
    getArchivedUsers,
    permanentDeleteUser,
    restoreUser,
    blockUser,
    unblockUser,
    getBlockedUsers,
    uploadProfileImage,
    deleteProfileImage
};
