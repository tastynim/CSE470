// server.js
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db.js');
const orderRoutes = require('./routes/orderRoutes'); // Import your routes
const reviewRoutes = require('./routes/reviewRoutes'); // review routes
const analyticsRoutes = require('./routes/analyticsRoutes');
const productRoutes = require('./routes/productRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const skillUploadRoutes = require('./routes/skillUploadRoutes');
const discussRoutes = require('./routes/discussRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const adminApproveRoutes = require('./routes/adminApproveRoutes');

// Load the secret variables from the .env file
dotenv.config(); 

// Connect to MongoDB
connectDB();     

// Initialize the Express app
const app = express();

// Middleware to allow your server to read JSON data
app.use(express.json());

// simple request logger for debugging
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} ${req.url}`);
  next();
});

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
app.use('/api', uploadRoutes);
app.use('/api/auth', authRoutes);
// payment endpoints
app.use('/api/payments', paymentRoutes);
// training resources
app.use('/api/resources', resourceRoutes);
// skill certification uploads
app.use('/api/skill-uploads', skillUploadRoutes);
// community forum / discussion board
app.use('/api/forum', discussRoutes);
// mentorship requests
app.use('/api/mentorship', mentorRoutes);
// admin approval system
app.use('/api/admin-approve', adminApproveRoutes);

// Serve React frontend (after npm run build inside client/)
const clientBuild = path.join(__dirname, 'client', 'build');
app.use(express.static(clientBuild));
// For any non-API route, send back React's index.html
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(clientBuild, 'index.html'));
});

// Set the port (use the one from .env, or default to 5000)
const PORT = process.env.PORT || 5000;

// --- THIS IS WHERE APP.LISTEN GOES! ---
// It turns the server on at the very end
app.listen(PORT, () => {
    console.log(`Server running successfully on port ${PORT}`);
});

