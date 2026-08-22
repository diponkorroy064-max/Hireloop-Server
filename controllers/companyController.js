const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

// company api---
const createCompany = async (req, res) => {
    try {
        const db = getDB();
        const companyCollection = db.collection("companies");
        const company = req.body;

        const newCompany = {
            ...company,
            createdAt: new Date()
        };

        const result = await companyCollection.insertOne(newCompany);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyCompany = async (req, res) => {
    try {
        const db = getDB();
        const companyCollection = db.collection("companies");
        const query = {};

        if (req.query.recruiterId) {
            query.recruiterId = req.query.recruiterId;
        }

        const result = await companyCollection.findOne(query);
        res.json(result || {});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// // inefficient way to join/aggregate collection---
const getCompanies = async (req, res) => {
    try {
        const db = getDB();
        const companyCollection = db.collection("companies");
        const jobsCollection = db.collection("jobs");

        const cursor = companyCollection.find();
        const companies = await cursor.toArray();

        for (const company of companies) {
            const filter = {
                companyId: company._id.toString()
            };
            const jobCount = await jobsCollection.countDocuments(filter);
            company.jobCount = jobCount;
        }

        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCompanyStatus = async (req, res) => {
    try {
        const db = getDB();
        const companyCollection = db.collection("companies");
        const id = req.params.id;
        const updatedCompany = req.body;

        const filter = { _id: new ObjectId(id) };
        const updatedDoc = {
            $set: {
                status: updatedCompany.status
            }
        };

        const result = await companyCollection.updateOne(filter, updatedDoc);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCompany,
    getMyCompany,
    getCompanies,
    updateCompanyStatus
};
