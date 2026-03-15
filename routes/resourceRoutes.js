const express = require('express');
const router = express.Router();
const { listResources, getResource, createResource, deleteResource } = require('../controllers/resource_back');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.get('/', listResources);                               // GET  /api/resources
router.get('/:id', getResource);                              // GET  /api/resources/:id
router.post('/', protect, createResource);                    // POST /api/resources
router.delete('/:id', protect, restrictTo('Admin'), deleteResource); // DELETE /api/resources/:id

module.exports = router;
