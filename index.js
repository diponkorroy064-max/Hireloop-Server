const express = require('express')
const app = express()
const port = process.env.PORT || 8000
require('dotenv').config()

const cors = require('cors');
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URL;

const logger = (req, res, next) => {
    console.log('logger middleware logged', req.params);
    next();
};


// Create a MongoClient with a MongoClientOptions object to set the Stable API version---
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


const run = async () => {
    try {
        // Connect the client to the server---
        await client.connect();
        const database = client.db("hireloop-project");

        const jobsCollection = database.collection("jobs");
        const companyCollection = database.collection("companies");
        const userCollection = database.collection("user");
        const applicationCollection = database.collection("applications");
        const planCollection = database.collection('plans');
        const subscriptionCollection = database.collection('subscriptions');
        const sessionCollection = database.collection('session');

        
        // varification related api---
        const varifyToken = async (req, res, next) => {
            // console.log('headers', req.headers);
            const authHeader = req.headers?.authorization;
            if (!authHeader) {
                return res.status(401).send({ message: 'unauthorized access' })
            }
            const token = authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).send({ message: 'unauthorized access' })
            }
            const query = { token: token };
            const session = await sessionCollection.findOne(query);
            if (!session) {
                return res.status(401).send({
                    message: "Invalid or expired token",
                });
            }
            // console.log("session", session);
            const userId = session.userId;
            // console.log('userId of the session', userId);

            const userQuery = {
                _id: userId
            }

            const user = await userCollection.findOne(userQuery);
            if (!user) {
                return res.status(401).send({
                    message: "User not found",
                });
            }
            // console.log('user of the session', user);

            req.user = user;
            next();
        }

        // must be used after varify token---
        const varifySeeker = async (req, res, next) => {
            if (req.user?.role !== 'seeker') {
                return res.status(403).send({ message: 'forbidden access' })
            }
            next();
        };

        // must be used after varify token---
        const varifyAdmin = async (req, res, next) => {
            if (req.user?.role !== 'admin') {
                return res.status(403).send({message: 'forbidden access'})
            }
            next();
        };

        // must be used after varify token---
        const varifyRecruiter = async (req, res, next) => {
            if (req.user?.role !== 'recruiter') {
                return res.status(403).send({ message: 'forbidden access' })
            }
            next();
        };

        // user api---
        app.get('/api/users', async (req, res) => {
            const users = await userCollection.find().toArray();
            res.json(users);
        })

        // jobs api---
        app.post('/api/jobs', async (req, res) => {
            const job = req.body;
            const newJob = {
                ...job,
                createdAt: new Date()
            }
            const result = await jobsCollection.insertOne(newJob);
            // console.log("data committed", result);
            res.json(result);
        })

        
        // get all jobs in jobs page---
        app.get('/api/jobs', async(req, res) => {
            console.log('server side q', req.query);
            const query = {};
            // console.log(req.query);

            // job filter related query---
            if (req.query.search) {
                query.$or = [
                    {jobTitle: { $regex: req.query.search, $options: 'i'}},
                    {companyName: { $regex: req.query.search, $options: 'i'}}
                ]
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
                const page = req.query.page;
                const perPage = req.query.perPage || 12;
                const skipItems = (page - 1) * perPage;
                
                const total = await jobsCollection.countDocuments(query);

                const cursor = jobsCollection.find(query).skip(skipItems).limit(perPage);

                const jobs = await cursor.toArray();
                return res.send({ jobs, total});
            }

            const cursor = jobsCollection.find(query);
            const result = await cursor.toArray();
            // console.log(result);
            res.json(result);
        })


        app.get('/api/jobs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await jobsCollection.findOne(query);
            res.json(result || {});
        });


        // company api---
        app.post('/api/companies', async (req, res) => {
            const company = req.body;
            const newCompany = {
                ...company,
                createdAt: new Date()
            }
            const result = await companyCollection.insertOne(newCompany);
            // console.log("data committed", result);
            res.json(result);
        });


        app.get('/api/my/companies', async (req, res) => {
            const query = {};
            // console.log("query", req.query);
            if (req.query.recruiterId) {
                query.recruiterId = req.query.recruiterId;
            }
            const result = await companyCollection.findOne(query);
            res.json(result || {});
        });


        // app.get('/api/companies', async (req, res) => {
        //     const cursor = companyCollection.find();
        //     const result = await cursor.toArray();
        //     res.json(result);
        // });


        // inefficient way to join/aggregate collection---
        app.get('/api/companies', async (req, res) => {
            const cursor = companyCollection.find();
            const companies = await cursor.toArray();

            for (const company of companies) {
                const filter = {
                    companyId: company._id.toString()
                }
                const jobCount = await jobsCollection.countDocuments(filter);
                company.jobCount = jobCount
            }
            res.json(companies);
        });


        // efficient way to join/aggregate collection---
        // app.get('/api/companies2', async (req, res) => {
        //     const pipeline = [
        //         {
        //             $skip: 5
        //         }
        //     ];
        //     const cursor = companyCollection.aggregate(pipeline);
        //     const result = await cursor.toArray();
        //     res.json(result);
        // });


        app.get("/api/stats", async (req, res) => {
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
        });


        app.patch('/api/companies/:id', logger, varifyToken, varifyAdmin, async (req, res) => {
            try {
                const id = req.params.id;
                const updatedCompany = req.body;

                const filter = {
                    _id: new ObjectId(id)
                };

                const updatedDoc = {
                    $set: {
                        status: updatedCompany.status
                    }
                };

                const result = await companyCollection.updateOne(
                    filter,
                    updatedDoc
                );

                res.json(result);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    message: error.message
                });
            }
        });


        // application api----
        app.post('/api/applications', async (req, res) => {
            const application = req.body;
            const newApplication = {
                ...application,
                createdAt: new Date()
            }
            const result = await applicationCollection.insertOne(newApplication);
            res.json(result);
        })


        app.get('/api/applications', varifyToken, varifySeeker, async (req, res) => {
            const query = {};

            if (req.query.applicantId) {
                query.applicantId = req.query.applicantId
                // check wheather asking for user--
                console.log(req.user, req.query.applicantId);
            }
            if (req.query.jobId) {
                query.jobId = req.query.jobId;
            }
            // console.log("Query", query);

            const cursor = applicationCollection.find(query);
            const result = await cursor.toArray();
            res.json(result);
        });


        // plans api----
        app.get('/api/plans', async (req, res) => {
            const query = {};
            if (req.query.plan_id) {
                query.id = req.query.plan_id
            }
            // console.log("Plan Query", query);
            const plan = await planCollection.findOne(query);
            // console.log("plans",plan);
            res.json(plan);
        })


        // subscription api---
        app.post('/api/subscriptions', async (req, res) => {
            const data = req.body;
            const subInfo = {
                ...data,
                createdAt: new Date()
            }
            const result = await subscriptionCollection.insertOne(subInfo);
            const filter = { email: data.email };
            const updateDocument = {
                $set: {
                    plan: data.planId,
                },
            };
            const updateResult = await userCollection.updateOne(filter, updateDocument);
            res.json(updateResult);
        })


        // Send a ping to confirm a successful connection---
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello Diponkor HireLoop Server is Running.......!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

