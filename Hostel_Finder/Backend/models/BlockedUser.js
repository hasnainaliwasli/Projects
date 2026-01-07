const mongoose = require('mongoose');

const blockedUserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    blockedAt: {
        type: Date,
        default: Date.now
    },
    blockedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reason: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('BlockedUser', blockedUserSchema);
