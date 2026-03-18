// server.js
const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const { Server } = require('socket.io'); 
const connectDB = require('./config/db.js');

// Import your database models
const Message = require('./models/Message'); // Import the new Message model

// Import your routes
const orderRoutes = require('./routes/orderRoutes'); 
const reviewRoutes = require('./routes/reviewRoutes'); 
const analyticsRoutes = require('./routes/analyticsRoutes');
const productRoutes = require('./routes/productRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const authRoutes = require('./routes/authRoutes');

// Load the secret variables from the .env file
dotenv.config(); 

// Connect to MongoDB
connectDB();     

// Initialize the Express app
const app = express();
const server = http.createServer(app);

// Attach Socket.io to the server
const io = new Server(server, {
    cors: {
        origin: "*", // Allow any frontend to connect for now
        methods: ["GET", "POST"]
    }
});

// Handle real-time WebSocket connections
io.on('connection', (socket) => {
    console.log('A user connected! Socket ID:', socket.id);

    // Listen for a message from a customer or entrepreneur
    socket.on('send_message', async (data) => {
        console.log('Message received from frontend:', data);
        
        try {
            // 1. Create and save the message to MongoDB
            const newMessage = new Message({
                sender: data.sender,     
                receiver: data.receiver, 
                text: data.text
            });
            
            await newMessage.save(); // Wait for it to save to the database
            console.log('Success! Message permanently saved to database.');

            // 2. Broadcast the newly saved message back out to the recipient
            io.emit('receive_message', newMessage); 
        } catch (error) {
            console.error("Error saving message:", error.message);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Middleware to allow your server to read JSON data
app.use(express.json());

// Simple request logger for debugging standard API routes
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} ${req.url}`);
  next();
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Server running successfully', status: 'online' });
});

// Tell the app to use the routes we created
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/products', productRoutes);
app.use('/api', uploadRoutes);
app.use('/api/auth', authRoutes);

// Set the port (use the one from .env, or default to 5000)
const PORT = process.env.PORT || 5000;

// Start the server (MUST be server.listen for Socket.io to work)
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
 
