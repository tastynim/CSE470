const express = require('express');
const router = express.Router();
const {
    listMentors,
    sendRequest,
    listMyRequests,
    listIncomingRequests,
    updateRequestStatus
} = require('../controllers/mentor_back');
const { protect } = require('../middleware/authMiddleware');

router.get('/mentors', listMentors);                                    // GET  /api/mentorship/mentors
router.post('/request', protect, sendRequest);                          // POST /api/mentorship/request
router.get('/my-requests', protect, listMyRequests);                    // GET  /api/mentorship/my-requests
router.get('/incoming', protect, listIncomingRequests);                 // GET  /api/mentorship/incoming
router.put('/request/:id/status', protect, updateRequestStatus);        // PUT  /api/mentorship/request/:id/status

module.exports = router;
