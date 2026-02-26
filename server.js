// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const orderRoutes = require('./routes/orderRoutes'); // Import your routes
const reviewRoutes = require('./routes/reviewRoutes'); // review routes
const analyticsRoutes = require('./routes/analyticsRoutes');
const productRoutes = require('./routes/productRoutes');
// Load the secret variables from the .env file
dotenv.config(); 

// Connect to MongoDB
connectDB();     

// Initialize the Express app
const app = express();

// Middleware to allow your server to read JSON data
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Server running successfully', status: 'online' });
});

// Tell the app to use the order routes we created
app.use('/api/orders', orderRoutes);
// reviews
app.use('/api/reviews', reviewRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/products', productRoutes);
// Set the port (use the one from .env, or default to 5000)
const PORT = process.env.PORT || 5000;

// --- THIS IS WHERE APP.LISTEN GOES! ---
// It turns the server on at the very end
app.listen(PORT, () => {
    console.log(`Server running successfully on port ${PORT}`);
});

