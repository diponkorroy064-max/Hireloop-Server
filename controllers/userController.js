const { getDB } = require('../config/db');

// user api---
const getAllUsers = async (req, res) => {
    try {
        const db = getDB();
        const userCollection = db.collection("user");
        const users = await userCollection.find().toArray();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllUsers };
