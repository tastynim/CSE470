const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        en: { type: String, required: true },
        bn: { type: String, required: true }
    },
    description: {
        en: { type: String, required: true },
        bn: { type: String, required: true }
    },
    price: { 
        type: Number, 
        required: true 
    },
    category: {
        type: String,
        required: true
    },
    images: [{ type: String }],
    stock: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
