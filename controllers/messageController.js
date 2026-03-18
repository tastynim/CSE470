const Message = require('../models/Message');

// Fetch chat history between two users
const getMessages = async (req, res) => {
    try {
        const { user1Id, user2Id } = req.params;

        // Find all messages where these two users are the sender/receiver
        const messages = await Message.find({
            $or: [
                { sender: user1Id, receiver: user2Id },
                { sender: user2Id, receiver: user1Id }
            ]
        }).sort({ createdAt: 1 }); // Sort by time created (oldest first, like a real chat app)

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Server error fetching chat history" });
    }
};

module.exports = { getMessages };