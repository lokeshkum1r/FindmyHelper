const Order = require('../models/Order');

class OrderController {
  // Create new order
  static async createOrder(req, res) {
    try {
      const userId = req.user.id;
      const { items, totals, address, paymentMethod, invoiceNo } = req.body;

      const orderData = {
        userId,
        invoiceNo: invoiceNo || `INV-${Date.now()}`,
        items,
        address,
        totals,
        paymentMethod: paymentMethod || "COD",
        paymentStatus: "pending",
        status: "pending"
      };

      const order = new Order(orderData);
      const errors = order.validateSync();

      if (errors) {
        return res.status(400).json({
          success: false,
          message: "Order validation failed",
          errors: errors.message
        });
      }

      await order.save();
      res.status(201).json({ success: true, order });
    } catch (error) {
      console.error("Order error:", error);
      res.status(500).json({
        success: false,
        message: error.name === 'ValidationError' ? 'Invalid data format' : 'Server error'
      });
    }
  }

  static async getUserOrders(req, res) {
    try {
      const userId = req.user?._id || req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: no user ID' });
      }

      const orders = await Order.find({ userId });

      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: 'No orders found' });
      }

      res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: 'Error fetching orders', error });
    }
  }

  static async getOrderById(req, res) {
    try {
      const { orderId } = req.params;
      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.status(200).json({
        success: true,
        order
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching order',
        error: error.message
      });
    }
  }

  static async updateOrderStatus(req, res) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      const order = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.status(200).json({
        success: true,
        order,
        message: 'Order status updated'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating order',
        error: error.message
      });
    }
  }
}

module.exports = OrderController;
