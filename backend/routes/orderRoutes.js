const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const authenticate = require('../middlewares/auth');

// Create new order
router.post('/', authenticate, OrderController.createOrder);

// Get user's orders
router.get('/user/:userId', authenticate, OrderController.getUserOrders);

// Get order by ID
router.get('/:orderId', authenticate, OrderController.getOrderById);

// Update order status (admin only)
router.put('/:orderId/status', authenticate, OrderController.updateOrderStatus);



module.exports = router;