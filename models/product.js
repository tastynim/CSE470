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
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);