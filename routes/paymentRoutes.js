const express = require('express');
const router = express.Router();
const {
    bankPayment,
    bkashPayment,
    rocketPayment,
    paymentWebhook,
    listPayments
} = require('../controllers/paymentController');

router.get('/', listPayments);          // list all payments (GET /api/payments/)
router.post('/bank', bankPayment);
router.post('/bkash', bkashPayment);
router.post('/rocket', rocketPayment);
// generic webhook endpoint
router.post('/webhook', paymentWebhook);

module.exports = router;
