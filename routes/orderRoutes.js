const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrderById, updateOrderStatus, getOrdersByCustomer } = require('../controllers/orderController');

// GET all orders
router.get('/', getOrders);

// POST create new order
router.post('/create', createOrder);

// GET order by ID
router.get('/customer/:email', getOrdersByCustomer);
router.get('/:id', getOrderById);

// PUT update order status
router.put('/:id/status', updateOrderStatus);

module.exports = router;
