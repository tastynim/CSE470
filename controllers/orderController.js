const Order = require('../models/Order');
const nodemailer = require('nodemailer');

// 1. Configure your Email Sender
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// 2. Function to handle new orders
const createOrder = async (req, res) => {
    try {
        const { customerName, customerEmail, productName, totalPrice } = req.body;

        // --- DATABASE CREATION HAPPENS HERE ---
        // This creates a new order and saves it to MongoDB
        const newOrder = new Order({
            customerName,
            customerEmail,
            productName,
            totalPrice
        });
        await newOrder.save(); 

        // --- EMAIL NOTIFICATION HAPPENS HERE ---
        // Send confirmation email to the customer
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: customerEmail,
            subject: 'Order Confirmation - Rural Women Empowerment',
            html: `
                <h3>Thank you for your order, ${customerName}!</h3>
                <p>You have successfully ordered <strong>${productName}</strong>.</p>
                <p>Total: $${totalPrice}</p>
                <p>Your support helps rural women entrepreneurs thrive!</p>
            `
        };

        // only attempt to send if credentials are provided
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                await transporter.sendMail(mailOptions);
                // email was sent
                res.status(201).json({ message: 'Order created and email sent successfully!', order: newOrder });
            } catch (emailErr) {
                console.error('Failed to send email:', emailErr);
                // respond success but warn that email failed
                res.status(201).json({
                    message: 'Order created but failed to send email',
                    order: newOrder,
                    emailError: emailErr.message || emailErr
                });
            }
        } else {
            console.warn('Email credentials not configured, skipping sendMail');
            res.status(201).json({ message: 'Order created (email not configured)', order: newOrder });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// 3. Get all orders
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
};

// 4. Get order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: order.customerEmail,
                subject: `Order Status Update - ${status}`,
                html: `
                    <h3>Hello ${order.customerName},</h3>
                    <p>Your order status has been updated to: <strong>${status}</strong></p>
                    <p>Order Details:</p>
                    <ul>
                        <li>Product: ${order.productName}</li>
                        <li>Total: $${order.totalPrice}</li>
                        <li>Status: ${status}</li>
                    </ul>
                `
            };

            try {
                await transporter.sendMail(mailOptions);
            } catch (emailErr) {
                console.error('Failed to send status update email:', emailErr);
            }
        }

        res.json({ message: 'Order status updated successfully', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 6. Get orders by customer email
const getOrdersByCustomer = async (req, res) => {
    try {
        const { email } = req.params;
        const orders = await Order.find({ customerEmail: email }).sort({ createdAt: -1 });
        res.json({ count: orders.length, orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus, getOrdersByCustomer };
