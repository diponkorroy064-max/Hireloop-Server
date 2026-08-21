const express = require('express');
const router = express.Router();
const logger = require('../middleware/logger');
const { varifyToken, varifyAdmin } = require('../middleware/auth');
const {
    createCompany,
    getMyCompany,
    getCompanies,
    updateCompanyStatus
} = require('../controllers/companyController');

router.post('/', createCompany);
router.get('/', getCompanies);
router.get('/my', getMyCompany);   // Handles /api/my/companies
router.patch('/:id', logger, varifyToken, varifyAdmin, updateCompanyStatus);

module.exports = router;

