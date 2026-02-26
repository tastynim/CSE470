// controllers/productController.js
const Product = require('../models/product');

// 1. Add a new product
const addProduct = async (req, res) => {
    try {
        // We pull exactly what matches your Thunder Client JSON
        const { name, description, price, category } = req.body;

        const newProduct = new Product({
            name,
            description,
            price,
            category
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully!', product: newProduct });
    } catch (error) {
        // This will print the exact reason to your terminal if it fails again
        console.error("MONGODB ERROR:", error.message); 
        res.status(500).json({ message: 'Failed to add product' });
    }
};

// 2. Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
};

module.exports = { addProduct, getAllProducts };