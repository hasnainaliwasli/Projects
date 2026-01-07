const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userImage: {
        type: String
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please add a rating between 1 and 5']
    },
    comment: {
        type: String,
        required: [true, 'Please add a comment']
    },
    proof: {
        type: String // URL to image
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent user from submitting more than one review per hostel (optional but good practice)
// reviewSchema.index({ hostel: 1, user: 1 }, { unique: true });

// Static method to get avg rating and save
reviewSchema.statics.getAverageRating = async function (hostelId) {
    const obj = await this.aggregate([
        {
            $match: { hostel: hostelId }
        },
        {
            $group: {
                _id: '$hostel',
                averageRating: { $avg: '$rating' }
            }
        }
    ]);

    try {
        await this.model('Hostel').findByIdAndUpdate(hostelId, {
            rating: obj[0] ? Math.round(obj[0].averageRating * 10) / 10 : 0
        });
    } catch (err) {
        console.error(err);
    }
};

// Call getAverageRating after save
reviewSchema.post('save', function () {
    this.constructor.getAverageRating(this.hostel);
});

// Call getAverageRating before remove
reviewSchema.pre('remove', function () {
    this.constructor.getAverageRating(this.hostel);
});

module.exports = mongoose.model('Review', reviewSchema);
