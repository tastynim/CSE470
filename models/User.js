const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'customer' } // Could be 'customer' or 'vendor'
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);