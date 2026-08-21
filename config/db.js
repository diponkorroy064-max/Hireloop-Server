const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URL;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let db;

const connectDB = async () => {
    if (db) return db;
    await client.connect();
    db = client.db("hireloop-project");

    // Ping confirmation---
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    return db;
};

const getDB = () => {
    if (!db) {
        throw new Error("Database not initialized. Call connectDB first.");
    }
    return db;
};

module.exports = { connectDB, getDB };
