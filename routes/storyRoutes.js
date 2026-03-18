const express = require('express');
const router = express.Router();
const { createStory, getAllStories, getStoryById } = require('../controllers/storyController');

// POST request to publish a new story
router.post('/', createStory);

// GET request to fetch all stories
router.get('/', getAllStories);

// GET request to fetch a single story by its ID
router.get('/:id', getStoryById);

module.exports = router;