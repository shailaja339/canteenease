const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    items: [
        {
            food: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Food'
            },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true }
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
        default: 0.0
    },
    pickupToken: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled', 'rejected'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['Cash at Counter', 'Online Payment'],
        default: 'Cash at Counter'
    },
    estimatedPickupTime: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
