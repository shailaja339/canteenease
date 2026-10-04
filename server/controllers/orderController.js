const Order = require('../models/Order');
const Food = require('../models/Food');
const Notification = require('../models/Notification');

// Generate Unique Order ID (e.g., CE-2026-001)
const generateOrderId = async () => {
    const today = new Date();
    const year = today.getFullYear();
    
    // Find the latest order for today to get the incrementing number
    const latestOrder = await Order.findOne({ 
        createdAt: { 
            $gte: new Date(today.setHours(0,0,0,0)), 
            $lt: new Date(today.setHours(23,59,59,999)) 
        } 
    }).sort({ createdAt: -1 });

    let count = 1;
    if (latestOrder && latestOrder.orderId) {
        const parts = latestOrder.orderId.split('-');
        if (parts.length === 3) {
            count = parseInt(parts[2]) + 1;
        }
    }

    return `CE-${year}-${count.toString().padStart(3, '0')}`;
};

// Generate Smart Pickup Token (Reset daily)
const generatePickupToken = async () => {
    const today = new Date();
    
    const latestOrder = await Order.findOne({ 
        createdAt: { 
            $gte: new Date(today.setHours(0,0,0,0)), 
            $lt: new Date(today.setHours(23,59,59,999)) 
        } 
    }).sort({ createdAt: -1 });

    if (latestOrder && latestOrder.pickupToken) {
        return latestOrder.pickupToken + 1;
    }
    
    return 1;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
    try {
        const { items, paymentMethod = 'Cash at Counter' } = req.body;

        if (!['Cash at Counter', 'Online Payment'].includes(paymentMethod)) {
            return res.status(400).json({ message: 'Select Cash at Counter or Online Payment' });
        }

        if (items && items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // Calculate total amount directly from database to prevent manipulation
        let totalAmount = 0;
        const verifiedItems = [];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const foodItem = await Food.findById(item.food);
            
            if (!foodItem || !foodItem.isAvailable) {
                return res.status(400).json({ message: `Food item ${item.name} is unavailable or not found` });
            }

            const itemTotal = foodItem.price * item.quantity;
            totalAmount += itemTotal;

            verifiedItems.push({
                food: foodItem._id,
                name: foodItem.name,
                price: foodItem.price,
                quantity: item.quantity
            });
        }

        const orderId = await generateOrderId();
        const pickupToken = await generatePickupToken();

        const order = new Order({
            orderId,
            student: req.user._id,
            items: verifiedItems,
            totalAmount,
            pickupToken,
            paymentMethod
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my
// @access  Private
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ student: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('student', 'name email studentId');
        if (order) {
            // Check if student is authorized to view (either admin or owner)
            if (req.user.role === 'admin' || order.student._id.toString() === req.user._id.toString()) {
                res.status(200).json(order);
            } else {
                res.status(401).json({ message: 'Not authorized to view this order' });
            }
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const allowedStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled', 'rejected'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid order status' });
        }
        const order = await Order.findById(req.params.id);

        if (order) {
            if (status !== order.status) {
                order.status = status;
                const updatedOrder = await order.save();
                
                // Create Notification
                let message = `Your order ${order.orderId} status is now ${status}.`;
                if (status === 'ready') {
                    message = `Your order ${order.orderId} is ready for pickup! Token: ${order.pickupToken}`;
                }
                if (status === 'completed') {
                    message = `Order Completed: Your order ${order.orderId} has been completed. Please collect your order from the canteen.`;
                }
                await Notification.create({
                    user: order.student,
                    message,
                    type: ['ready', 'completed'].includes(status) ? 'success' : 'info'
                });
                
                res.status(200).json(updatedOrder);
            } else {
                res.status(200).json(order);
            }
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('student', 'name studentId').sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
