const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cnic: {
        type: String,
        required: true
    },
    evidence: {
        type: String, // URL to image/video
        required: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hostelName: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        required: true,
        enum: ['fraud', 'fake', 'safety', 'harassment', 'spam', 'other']
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['unread', 'read', 'resolved'],
        default: 'unread'
    },
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    resolvedAt: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Report', reportSchema);
