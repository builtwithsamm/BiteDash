const express = require('express');
const router = express.Router();
const Order = require('./orderModel');

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ success: false, message: 'Please login to continue' });
};

// Place new order
router.post('/create', isLoggedIn, async (req, res) => {
  try {
    const { items, totalAmount, deliveryAddress, phone, paymentMethod } = req.body;
    const newOrder = new Order({
      user: req.user._id,
      items,
      totalAmount,
      deliveryAddress,
      phone,
      paymentMethod
    });
    await newOrder.save();
    res.json({ success: true, message: 'Order placed successfully!', order: newOrder });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get user orders
router.get('/my-orders', isLoggedIn, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
