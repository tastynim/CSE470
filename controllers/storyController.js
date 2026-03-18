const Story = require('../models/Story');

// 1. Create a new success story
const createStory = async (req, res) => {
    try {
        const { title, content, author, imageUrl } = req.body;

        const newStory = new Story({
            title,
            content,
            author, // This should be the 24-character User ID of the author
            imageUrl
        });

        await newStory.save();
        res.status(201).json({ message: "Success story published!", story: newStory });
    } catch (error) {
        console.error("Error creating story:", error);
        res.status(500).json({ message: "Failed to publish story" });
    }
};

// 2. Get all success stories (for the main blog page)
const getAllStories = async (req, res) => {
    try {
        // We sort by 'createdAt: -1' so the newest stories show up first!
        const stories = await Story.find().sort({ createdAt: -1 });
        res.status(200).json(stories);
    } catch (error) {
        console.error("Error fetching stories:", error);
        res.status(500).json({ message: "Failed to fetch stories" });
    }
};

// 3. Get a single success story by its ID (for reading the full article)
const getStoryById = async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);
        if (!story) {
            return res.status(404).json({ message: "Story not found" });
        }
        res.status(200).json(story);
    } catch (error) {
        console.error("Error fetching single story:", error);
        res.status(500).json({ message: "Failed to fetch the story" });
    }
};

module.exports = { createStory, getAllStories, getStoryById };