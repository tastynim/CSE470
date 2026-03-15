const express = require('express');
const router = express.Router();
const { listPosts, getPost, createPost, addComment, deletePost } = require('../controllers/discuss_back');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.get('/', listPosts);                                          // GET  /api/forum
router.get('/:id', getPost);                                         // GET  /api/forum/:id
router.post('/', protect, createPost);                               // POST /api/forum
router.post('/:id/comment', protect, addComment);                    // POST /api/forum/:id/comment
router.delete('/:id', protect, restrictTo('Admin'), deletePost);     // DELETE /api/forum/:id

module.exports = router;
