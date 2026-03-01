// controllers/paymentController.js
const Payment = require('../models/Payment');
const Order = require('../models/Order');

// create a payment record for offline bank transfer
const bankPayment = async (req, res) => {
    try {
        const { orderId, amount } = req.body;
        if (!orderId || !amount) {
            return res.status(400).json({ message: 'orderId and amount are required' });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // create a Payment document
        const payment = new Payment({
            order: order._id,
            method: 'Bank',
            amount,
            status: 'Pending',
            meta: {
                instructions: process.env.BANK_INSTRUCTIONS || 'Transfer to 0123456789, DBBL, account name Rural Women.'
            }
        });

        await payment.save();

        res.status(201).json({
            message: 'Bank transfer initiated',
            payment,
            instructions: payment.meta.instructions
        });
    } catch (err) {
        console.error('bankPayment error', err);
        res.status(500).json({ message: 'Failed to create bank payment' });
    }
};

// placeholder for bkash checkout
const bkashPayment = async (req, res) => {
    // in a real implementation you would call bKash API using credentials
    const { orderId, amount } = req.body;
    if (!orderId || !amount) return res.status(400).json({ message: 'orderId and amount required' });

    // simply create record for now
    const payment = new Payment({ order: orderId, method: 'Bkash', amount });
    await payment.save();
    res.json({ message: 'bkash payment placeholder', payment });
};

// placeholder for rocket checkout
const rocketPayment = async (req, res) => {
    const { orderId, amount } = req.body;
    if (!orderId || !amount) return res.status(400).json({ message: 'orderId and amount required' });

    const payment = new Payment({ order: orderId, method: 'Rocket', amount });
    await payment.save();
    res.json({ message: 'rocket payment placeholder', payment });
};

// list all payments (for debugging/admins)
const listPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate('order');
        res.json(payments);
    } catch (err) {
        console.error('listPayments error', err);
        res.status(500).json({ message: 'Unable to fetch payments' });
    }
};

// Webhook handler for external gateways (generic)
const paymentWebhook = async (req, res) => {
    // This endpoint would be called by bKash/Rocket/etc with event data
    // Example body: { paymentId, status, transactionId }
    const { paymentId, status, transactionId, meta } = req.body;
    if (!paymentId || !status) {
        return res.status(400).json({ message: 'paymentId and status required' });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    payment.status = status;
    if (transactionId) payment.transactionId = transactionId;
    if (meta) payment.meta = { ...payment.meta, ...meta };
    await payment.save();

    // could also update order status here if needed
    res.json({ message: 'acknowledged' });
};

module.exports = { bankPayment, bkashPayment, rocketPayment, paymentWebhook, listPayments };
