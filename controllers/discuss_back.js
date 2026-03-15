// controllers/discuss_back.js — Community Forum / Discussion Board
const ForumPost = require('../models/ForumPost');

const listPosts = async (req, res) => {
    try {
        const filter = req.query.category ? { category: req.query.category } : {};
        const posts = await ForumPost.find(filter)
            .populate('user', 'name')
            .populate('comments.user', 'name')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        console.error('listPosts error', err);
        res.status(500).json({ message: 'Failed to fetch posts' });
    }
};

const getPost = async (req, res) => {
    try {
        const post = await ForumPost.findById(req.params.id)
            .populate('user', 'name')
            .populate('comments.user', 'name');
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (err) {
        console.error('getPost error', err);
        res.status(500).json({ message: 'Failed to fetch post' });
    }
};

const createPost = async (req, res) => {
    try {
        const { title, content, category } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: 'title and content are required' });
        }
        const post = new ForumPost({
            user: req.user.id,
            title,
            content,
            category: category || 'General'
        });
        await post.save();
        res.status(201).json({ message: 'Post created', post });
    } catch (err) {
        console.error('createPost error', err);
        res.status(500).json({ message: 'Failed to create post' });
    }
};

const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: 'Comment text is required' });
        const post = await ForumPost.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        post.comments.push({ user: req.user.id, text });
        await post.save();
        await post.populate('comments.user', 'name');
        res.json({ message: 'Comment added', post });
    } catch (err) {
        console.error('addComment error', err);
        res.status(500).json({ message: 'Failed to add comment' });
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await ForumPost.findByIdAndDelete(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json({ message: 'Post deleted' });
    } catch (err) {
        console.error('deletePost error', err);
        res.status(500).json({ message: 'Failed to delete post' });
    }
};

module.exports = { listPosts, getPost, createPost, addComment, deletePost };
