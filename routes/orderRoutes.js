const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/orderController');

// This creates the POST endpoint
router.post('/create', createOrder);

module.exports = router;