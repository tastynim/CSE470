const express = require('express');
const router = express.Router();
const { addProduct, getAllProducts, searchProducts, getProductById, updateProduct } = require('../controllers/productController');

router.post('/add', addProduct);
router.get('/all', getAllProducts);
router.get('/search', searchProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);

module.exports = router;
