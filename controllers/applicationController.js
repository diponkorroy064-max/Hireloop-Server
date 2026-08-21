const { getDB } = require('../config/db');

// application api----
const createApplication = async (req, res) => {
    try {
        const db = getDB();
        const applicationCollection = db.collection("applications");
        const application = req.body;

        const newApplication = {
            ...application,
            createdAt: new Date()
        };

        const result = await applicationCollection.insertOne(newApplication);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getApplications = async (req, res) => {
    try {
        const db = getDB();
        const applicationCollection = db.collection("applications");
        const query = {};

        if (req.query.applicantId) {
            query.applicantId = req.query.applicantId;
            console.log(req.user, req.query.applicantId);
        }

        if (req.query.jobId) {
            query.jobId = req.query.jobId;
        }

        const cursor = applicationCollection.find(query);
        const result = await cursor.toArray();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createApplication,
    getApplications
};
