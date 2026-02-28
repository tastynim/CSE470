// controllers/productController.js
const Product = require('../models/product');

// 1. Add a new product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, images, stock } = req.body;

        const newProduct = new Product({
            name,
            description,
            price,
            category,
            images: images || [],
            stock: stock || 0
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully!', product: newProduct });
    } catch (error) {
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

// 3. Search and filter products
const searchProducts = async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice, sort } = req.query;
        let filter = {};

        if (category) filter.category = category;
        if (search) {
            filter.$or = [
                { 'name.en': { $regex: search, $options: 'i' } },
                { 'name.bn': { $regex: search, $options: 'i' } }
            ];
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        let query = Product.find(filter);
        if (sort) {
            const sortOrder = sort.startsWith('-') ? -1 : 1;
            const sortField = sort.replace('-', '');
            query = query.sort({ [sortField]: sortOrder });
        }

        const products = await query;
        res.json({ count: products.length, products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Get product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. Update product
const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, images, stock } = req.body;

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = price;
        if (category) product.category = category;
        if (images) product.images = images;
        if (stock !== undefined && stock >= 0) product.stock = stock;

        await product.save();
        res.json({ message: 'Product updated successfully', product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product' });
  }
};

module.exports = { addProduct, getAllProducts, searchProducts, getProductById, updateProduct, deleteProduct };
