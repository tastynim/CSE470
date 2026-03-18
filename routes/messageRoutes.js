const express = require('express');
const router = express.Router();
const { getMessages } = require('../controllers/messageController');

// GET request to fetch messages between user1 and user2
router.get('/:user1Id/:user2Id', getMessages);

module.exports = router;