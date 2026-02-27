const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // MISSING FIELD ADDED!
    role: { type: String, default: 'customer' },
    isRural: { type: Boolean, default: false }, // Added from your register body
    location: { type: String },                 // Added from your register body
    skills: [{ type: String }]                  // Added from your register body
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);;
