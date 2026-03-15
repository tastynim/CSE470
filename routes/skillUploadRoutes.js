const express = require('express');
const router = express.Router();
const upload = require('../utils/fileUpload');
const { listCertifications, uploadCertification, updateCertificationStatus } = require('../controllers/skill_upload_back');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.get('/', protect, listCertifications);                                             // GET  /api/skill-uploads
router.post('/', protect, upload.single('certificationFile'), uploadCertification);       // POST /api/skill-uploads
router.put('/:id/status', protect, restrictTo('Admin'), updateCertificationStatus);       // PUT  /api/skill-uploads/:id/status

module.exports = router;
