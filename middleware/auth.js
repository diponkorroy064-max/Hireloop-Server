const { getDB } = require('../config/db');

// verification related api---
const varifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers?.authorization;
        if (!authHeader) {
            return res.status(401).send({ message: 'unauthorized access' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).send({ message: 'unauthorized access' });
        }

        const db = getDB();
        const sessionCollection = db.collection('session');
        const userCollection = db.collection('user');

        const query = { token: token };
        const session = await sessionCollection.findOne(query);

        if (!session) {
            return res.status(401).send({
                message: "Invalid or expired token",
            });
        }

        const userId = session.userId;
        const userQuery = { _id: userId };

        const user = await userCollection.findOne(userQuery);
        if (!user) {
            return res.status(401).send({
                message: "User not found",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// must be used after varify token---
const varifySeeker = async (req, res, next) => {
    if (req.user?.role !== 'seeker') {
        return res.status(403).send({ message: 'forbidden access' });
    }
    next();
};

// must be used after varify token---
const varifyAdmin = async (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).send({ message: 'forbidden access' });
    }
    next();
};

// must be used after varify token---
const varifyRecruiter = async (req, res, next) => {
    if (req.user?.role !== 'recruiter') {
        return res.status(403).send({ message: 'forbidden access' });
    }
    next();
};

module.exports = {
    varifyToken,
    varifySeeker,
    varifyAdmin,
    varifyRecruiter
};
