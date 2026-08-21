const { getDB } = require('../config/db');

// subscription api---
const createSubscription = async (req, res) => {
    try {
        const db = getDB();
        const subscriptionCollection = db.collection('subscriptions');
        const userCollection = db.collection('user');
        const data = req.body;

        const subInfo = {
            ...data,
            createdAt: new Date()
        };

        const result = await subscriptionCollection.insertOne(subInfo);

        const filter = { email: data.email };
        const updateDocument = {
            $set: {
                plan: data.planId,
            },
        };

        const updateResult = await userCollection.updateOne(filter, updateDocument);
        res.json(updateResult);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createSubscription };
