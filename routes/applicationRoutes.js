const express = require('express');
const router = express.Router();
const { varifyToken, varifySeeker } = require('../middleware/auth');
const { createApplication, getApplications } = require('../controllers/applicationController');

router.post('/', createApplication);
router.get('/', varifyToken, varifySeeker, getApplications);

module.exports = router;
