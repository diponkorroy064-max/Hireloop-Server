const { getDB } = require('../config/db');

// plans api----
const getPlan = async (req, res) => {
    try {
        const db = getDB();
        const planCollection = db.collection('plans');
        const query = {};

        if (req.query.plan_id) {
            query.id = req.query.plan_id;
        }

        const plan = await planCollection.findOne(query);
        res.json(plan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getPlan };
