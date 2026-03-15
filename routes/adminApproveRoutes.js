const express = require('express');
const router = express.Router();
const {
    getPendingUsers, approveUser, rejectUser,
    getPendingProducts, approveProduct, rejectProduct,
    getPendingCertifications, approveCertification, rejectCertification
} = require('../controllers/admin_approve_back');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const adminOnly = [protect, restrictTo('Admin')];

// Users
router.get('/users/pending',          ...adminOnly, getPendingUsers);          // GET  /api/admin-approve/users/pending
router.put('/users/:id/approve',      ...adminOnly, approveUser);              // PUT  /api/admin-approve/users/:id/approve
router.put('/users/:id/reject',       ...adminOnly, rejectUser);               // PUT  /api/admin-approve/users/:id/reject

// Products
router.get('/products/pending',       ...adminOnly, getPendingProducts);       // GET  /api/admin-approve/products/pending
router.put('/products/:id/approve',   ...adminOnly, approveProduct);           // PUT  /api/admin-approve/products/:id/approve
router.put('/products/:id/reject',    ...adminOnly, rejectProduct);            // PUT  /api/admin-approve/products/:id/reject

// Skill Certifications
router.get('/certifications/pending', ...adminOnly, getPendingCertifications); // GET  /api/admin-approve/certifications/pending
router.put('/certifications/:id/approve', ...adminOnly, approveCertification); // PUT  /api/admin-approve/certifications/:id/approve
router.put('/certifications/:id/reject',  ...adminOnly, rejectCertification);  // PUT  /api/admin-approve/certifications/:id/reject

module.exports = router;
