const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById, getStats } = require('../controllers/jobController');

router.post('/', createJob);
router.get('/', getJobs);
router.get('/stats', getStats); // Handled /api/stats under job routes or separately
router.get('/:id', getJobById);

module.exports = router;
