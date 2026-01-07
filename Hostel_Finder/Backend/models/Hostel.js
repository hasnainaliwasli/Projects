const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description can not be more than 500 characters']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ownerName: {
        type: String,
        required: true
    },
    genderType: {
        type: String,
        enum: ['boys', 'girls', 'mixed'],
        required: true
    },
    location: {
        // GeoJSON Point
        city: { type: String, required: true },
        area: { type: String, required: true },
        address: { type: String, required: true },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    images: {
        type: [String],
        default: []
    },
    rooms: [{
        type: { type: String, required: true }, // e.g., "Single", "Double"
        capacity: { type: Number, required: true },
        rentPerRoom: { type: Number },
        rentPerBed: { type: Number }
    }],
    floors: {
        type: Number,
        required: true
    },
    roomsPerFloor: {
        type: Number
    },
    rent: {
        type: Number, // Starting price/base rent
        required: true
    },
    facilities: {
        fridge: { type: Boolean, default: false },
        water: { type: Boolean, default: false },
        electricity: { type: Boolean, default: false },
        wifi: { type: Boolean, default: false },
        laundry: { type: Boolean, default: false },
        parking: { type: Boolean, default: false },
        security: { type: Boolean, default: false },
        meals: { type: Boolean, default: false }
    },
    availableBeds: {
        type: Number,
        default: 0
    },
    availability: {
        type: String,
        enum: ['available', 'full', 'limited'],
        default: 'available'
    },
    contactNumber: {
        type: [String],
        required: true
    },
    isFor: {
        type: String,
        enum: ['boys', 'girls', 'mixed'],
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0 // Will be calculated dynamically usually, but keeping field for now to match frontend logic
    },
    reviews: [{ // Array of Review IDs if we want to store references here too, or just virtual populate
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Hostel', hostelSchema);
