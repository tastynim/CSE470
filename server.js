// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const productRoutes = require('./routes/productRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes'); // ← ADD THIS

dotenv.config(); 
connectDB();     

const app = express();

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use((req, res, next) => {
  console.log(`Incoming ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.json({ message: 'Server running successfully', status: 'online' });
});

app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/products', productRoutes);
app.use('/api', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes); // ← ADD THIS

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running successfully on port ${PORT}`);
});