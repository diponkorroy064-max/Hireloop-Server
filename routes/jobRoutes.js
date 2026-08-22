const express = require('express');
const router = express.Router();
const {createJob, getJobs, getJobById, getRecruiterJobs, getStats} = require('../controllers/jobController');

router.post('/', createJob);
router.get('/', getJobs);
router.get('/company/:companyId', getRecruiterJobs);
router.get('/stats', getStats);
router.get('/:id', getJobById);

module.exports = router;

