const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This links the story to the specific entrepreneur/user who wrote it
        required: true
    },
    imageUrl: {
        type: String, // Optional: Just in case you want to add cover photos later!
        default: ""
    }
}, { timestamps: true }); // This automatically tracks exactly when the story was published

module.exports = mongoose.model('Story', storySchema);