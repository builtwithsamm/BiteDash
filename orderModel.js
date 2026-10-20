const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      id: Number,
      name: String,
      price: Number,
      qty: Number
    }
  ],
  totalAmount: { type: Number, required: true },
  deliveryAddress: { type: String, required: true },
  phone: { type: String, required: true },
  paymentMethod: { type: String, default: "Cash on Delivery" },
  status: { type: String, default: "Order Placed" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
