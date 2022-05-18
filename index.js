const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.31xws.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        await client.connect();
        const tasksCollection = client.db("todo").collection("tasks");

        // Add
        app.post("/tasks", async (req, res) => {
            const task = req.body;
            const result = await tasksCollection.insertOne(task);
            res.send(result);
        });

        // Get
        app.get("/tasks", async (req, res) => {
            const email = req.query.email;
            const query = { email };
            const cursor = tasksCollection.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);
        });

        // Delete
        app.delete("/task/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await tasksCollection.deleteOne(query);
            res.send(result);
        });

        // Update Completed
        app.put('/task/:id', async (req, res) => {
            const id = req.params.id;
            // const updatedTask = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedData = {
                $set: {
                    done: true
                }
            };
            const result = await tasksCollection.updateOne(filter, updatedData, options);
            res.send(result);
        });

    } finally {
    }
}

run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Running Server");
});

app.listen(port, () => {
    console.log("Listening to port", port);
});