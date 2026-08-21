const express = require('express');
const router = express.Router();
const { createSubscription } = require('../controllers/subscriptionController');

router.post('/', createSubscription);

module.exports = router;
