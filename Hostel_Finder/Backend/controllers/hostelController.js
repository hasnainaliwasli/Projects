const asyncHandler = require('express-async-handler');
const Hostel = require('../models/Hostel');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

// @desc    Get all hostels with filtering
// @route   GET /api/hostels
// @access  Public
const getHostels = asyncHandler(async (req, res) => {
    const { city, area, isFor, minPrice, maxPrice, type } = req.query;

    let query = {};

    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    if (area) query['location.area'] = { $regex: area, $options: 'i' };
    if (isFor) query.isFor = isFor;
    if (type) query['rooms.type'] = type;
    if (req.query.owner) {
        query.owner = req.query.owner;
    } else if (req.query.mode === 'admin') {
        // Admin mode: fetch all hostels regardless of status
    } else {
        // If not looking for specific owner's hostels, show only approved ones
        // OR legacy hostels without status field (if any exist)
        query.$or = [{ status: 'approved' }, { status: { $exists: false } }];
    }

    if (minPrice || maxPrice) {
        query.rent = {};
        if (minPrice) query.rent.$gte = Number(minPrice);
        if (maxPrice) query.rent.$lte = Number(maxPrice);
    }

    const hostels = await Hostel.find(query);

    res.status(200).json(hostels);
});

// @desc    Get single hostel
// @route   GET /api/hostels/:id
// @access  Public
const getHostel = asyncHandler(async (req, res) => {
    const hostel = await Hostel.findById(req.params.id).populate('owner', 'fullName email phoneNumbers profileImage');

    if (!hostel) {
        res.status(404);
        throw new Error('Hostel not found');
    }

    res.status(200).json(hostel);
});

// @desc    Create new hostel
// @route   POST /api/hostels
// @access  Private (Owner only)
const createHostel = asyncHandler(async (req, res) => {
    // Check if user is owner
    if (req.user.role !== 'owner' && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to create a hostel');
    }

    if (req.files) {
        console.log('HOSTEL UPLOAD DEBUG (Create):', req.files.map(f => ({ path: f.path, filename: f.filename })));
    } else {
        console.log('HOSTEL UPLOAD DEBUG (Create): No files received');
    }

    const images = req.files ? req.files.map(file => file.path) : [];

    // Parse nested fields if they are strings (from FormData)
    let body = { ...req.body };
    ['location', 'facilities', 'rooms', 'contactNumber'].forEach(field => {
        if (typeof body[field] === 'string') {
            try {
                body[field] = JSON.parse(body[field]);
            } catch (e) {
                console.error(`Failed to parse ${field}:`, e);
            }
        }
    });

    const hostel = await Hostel.create({
        ...body,
        images,
        status: 'pending', // Establish default status explicitly
        owner: req.user.id,
        ownerName: req.user.fullName
    });

    // Notify Admins about new hostel request
    const admins = await User.find({ role: 'admin' });

    // Create notification for each admin
    const notificationPromises = admins.map(admin =>
        createNotification({
            recipient: admin._id,
            sender: req.user.id,
            type: 'NEW_HOSTEL_REQUEST',
            title: 'New Hostel Listing Request',
            message: `Owner ${req.user.fullName} has requested to list "${hostel.name}".`,
            relatedId: hostel._id,
            relatedModel: 'Hostel'
        })
    );

    await Promise.all(notificationPromises);

    res.status(201).json(hostel);
});

// @desc    Update hostel
// @route   PUT /api/hostels/:id
// @access  Private (Owner only)
const updateHostel = asyncHandler(async (req, res) => {
    const hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
        res.status(404);
        throw new Error('Hostel not found');
    }

    // Check user ownership
    if (hostel.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('User not authorized');
    }

    // If owner updates, reset to pending
    const updates = { ...req.body };
    if (req.user.role !== 'admin') {
        updates.status = 'pending';
    }

    // Parse nested fields for FormData
    ['location', 'facilities', 'rooms', 'contactNumber'].forEach(field => {
        if (typeof updates[field] === 'string') {
            try {
                updates[field] = JSON.parse(updates[field]);
            } catch (e) {
                console.error(`Failed to parse ${field}:`, e);
            }
        }
    });

    // Handle image updates
    if (req.files && req.files.length > 0) {
        console.log('HOSTEL UPLOAD DEBUG (Update):', req.files.map(f => ({ path: f.path, filename: f.filename })));
        const newImages = req.files.map(file => file.path);
        // If there are existing images in body (as strings), combine them
        let currentImages = updates.images ? (Array.isArray(updates.images) ? updates.images : [updates.images]) : [];
        // Filter out any base64 strings (starting with data:) and only keep URLs
        currentImages = currentImages.filter(img => typeof img === 'string' && img.startsWith('http'));
        updates.images = [...currentImages, ...newImages];
    }

    const updatedHostel = await Hostel.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true
    });

    res.status(200).json(updatedHostel);
});

// @desc    Update hostel status (Admin only)
// @route   PUT /api/hostels/:id/status
// @access  Private (Admin only)
const updateHostelStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    const hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
        res.status(404);
        throw new Error('Hostel not found');
    }

    // Check if user is admin - double check though middleware should handle it
    if (req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to update hostel status');
    }

    hostel.status = status;
    await hostel.save();

    // Notify Owner
    await createNotification({
        recipient: hostel.owner,
        sender: req.user.id, // Admin who updated it
        type: 'HOSTEL_STATUS',
        title: `Hostel ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: `Your hostel "${hostel.name}" has been ${status}.`,
        relatedId: hostel._id,
        relatedModel: 'Hostel'
    });

    res.status(200).json(hostel);
});

// @desc    Delete hostel
// @route   DELETE /api/hostels/:id
// @access  Private (Owner only)
const deleteHostel = asyncHandler(async (req, res) => {
    const hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
        res.status(404);
        throw new Error('Hostel not found');
    }

    // Check user ownership
    if (hostel.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('User not authorized');
    }

    await hostel.deleteOne();

    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getHostels,
    getHostel,
    createHostel,
    updateHostel,
    deleteHostel,
    updateHostelStatus
};
