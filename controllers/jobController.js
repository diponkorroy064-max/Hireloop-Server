const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');


// jobs api---
const createJob = async (req, res) => {
    try {
        const db = getDB();
        const jobsCollection = db.collection("jobs");
        const job = req.body;

        const newJob = {
            ...job,
            createdAt: new Date()
        };

        const result = await jobsCollection.insertOne(newJob);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// get all jobs in jobs page---
const getJobs = async (req, res) => {
    try {
        console.log('server side q', req.query);
        const db = getDB();
        const jobsCollection = db.collection("jobs");
        const query = {};

        // job filter related query---
        if (req.query.search) {
            query.$or = [
                { jobTitle: { $regex: req.query.search, $options: 'i' } },
                { companyName: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        if (req.query.jobType) {
            query.jobType = req.query.jobType;
        }

        // company related query---
        if (req.query.jobCategory) {
            query.jobCategory = req.query.jobCategory;
        }

        if (req.query.isRemote) {
            query.isRemote = req.query.isRemote;
        }

        if (req.query.companyId) {
            query.companyId = req.query.companyId;
        }

        if (req.query.status) {
            query.status = req.query.status;
        }

        // pagination related ---
        if (req.query.page) {
            const page = parseInt(req.query.page);
            const perPage = parseInt(req.query.perPage) || 12;
            const skipItems = (page - 1) * perPage;

            const total = await jobsCollection.countDocuments(query);
            const cursor = jobsCollection.find(query).skip(skipItems).limit(perPage);
            const jobs = await cursor.toArray();

            return res.send({ jobs, total });
        }

        const cursor = jobsCollection.find(query);
        const result = await cursor.toArray();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRecruiterJobs = async (req, res) => {
    try {
        const db = getDB();
        const jobsCollection = db.collection("jobs");
        const { companyId } = req.params;

        // console.log("Received companyId:", companyId);

        const result = await jobsCollection
            .find({ companyId: companyId })
            .toArray();

        // console.log("Found jobs:", result);

        res.status(200).json(result);

    } catch (error) {
        console.error("Error fetching recruiter jobs:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


const getJobById = async (req, res) => {
    try {
        const db = getDB();
        const jobsCollection = db.collection("jobs");
        const id = req.params.id;

        const query = { _id: new ObjectId(id) };
        const result = await jobsCollection.findOne(query);
        res.json(result || {});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// get Stats---
const getStats = async (req, res) => {
    try {
        const db = getDB();
        const jobsCollection = db.collection("jobs");

        const pipeline = [
            {
                $group: {
                    _id: '$jobType',
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    jobType: '$_id',
                    count: 0
                }
            },
            {
                $sort: { count: -1 }
            }
        ];

        const cursor = jobsCollection.aggregate(pipeline);
        const result = await cursor.toArray();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createJob, getJobs, getJobById,
    getStats,
    getRecruiterJobs
};

