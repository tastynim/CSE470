// controllers/admin_approve_back.js — Admin Approval System
const User = require('../models/User');
const Product = require('../models/product');
const SkillCertification = require('../models/SkillCertification');

/* ─── Users ─────────────────────────────────────────────── */
const getPendingUsers = async (req, res) => {
    try {
        const users = await User.find(
            { isApproved: false },
            'name email role isRural location skills createdAt'
        ).sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error('getPendingUsers error', err);
        res.status(500).json({ message: 'Failed to fetch pending users' });
    }
};

const approveUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User approved', user });
    } catch (err) {
        console.error('approveUser error', err);
        res.status(500).json({ message: 'Failed to approve user' });
    }
};

const rejectUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isApproved: false }, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User rejected', user });
    } catch (err) {
        console.error('rejectUser error', err);
        res.status(500).json({ message: 'Failed to reject user' });
    }
};

/* ─── Products ───────────────────────────────────────────── */
const getPendingProducts = async (req, res) => {
    try {
        const products = await Product.find({ isApproved: false }).sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        console.error('getPendingProducts error', err);
        res.status(500).json({ message: 'Failed to fetch pending products' });
    }
};

const approveProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product approved', product });
    } catch (err) {
        console.error('approveProduct error', err);
        res.status(500).json({ message: 'Failed to approve product' });
    }
};

const rejectProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, { isApproved: false }, { new: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product rejected', product });
    } catch (err) {
        console.error('rejectProduct error', err);
        res.status(500).json({ message: 'Failed to reject product' });
    }
};

/* ─── Skill Certifications ───────────────────────────────── */
const getPendingCertifications = async (req, res) => {
    try {
        const certs = await SkillCertification.find({ status: 'Pending' })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(certs);
    } catch (err) {
        console.error('getPendingCertifications error', err);
        res.status(500).json({ message: 'Failed to fetch pending certifications' });
    }
};

const approveCertification = async (req, res) => {
    try {
        const cert = await SkillCertification.findByIdAndUpdate(
            req.params.id, { status: 'Approved' }, { new: true }
        );
        if (!cert) return res.status(404).json({ message: 'Certification not found' });
        res.json({ message: 'Certification approved', certification: cert });
    } catch (err) {
        console.error('approveCertification error', err);
        res.status(500).json({ message: 'Failed to approve certification' });
    }
};

const rejectCertification = async (req, res) => {
    try {
        const cert = await SkillCertification.findByIdAndUpdate(
            req.params.id, { status: 'Rejected' }, { new: true }
        );
        if (!cert) return res.status(404).json({ message: 'Certification not found' });
        res.json({ message: 'Certification rejected', certification: cert });
    } catch (err) {
        console.error('rejectCertification error', err);
        res.status(500).json({ message: 'Failed to reject certification' });
    }
};

module.exports = {
    getPendingUsers, approveUser, rejectUser,
    getPendingProducts, approveProduct, rejectProduct,
    getPendingCertifications, approveCertification, rejectCertification
};
