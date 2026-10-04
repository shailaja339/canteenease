const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    food: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Food'
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Order'
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        validate: Number.isInteger
    },
    review: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: ''
    }
}, {
    timestamps: true
});

ratingSchema.index({ student: 1, order: 1, food: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
