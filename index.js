const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
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