const express = require('express');
const router = express.Router();
const upload = require('../config/upload');
const { addProduct, getAllProducts, searchProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');

router.post('/add', addProduct);
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ 
    message: 'Image uploaded successfully',
    imageUrl: `http://localhost:5000/uploads/${req.file.filename}`
  });
});
router.get('/all', getAllProducts);
router.get('/search', searchProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;