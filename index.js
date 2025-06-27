const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nttz9vg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const gardenerCollection = client.db("gardening").collection("gardeners");
    const usersCollection = client.db("gardening").collection("users");
    const shareTipsCollection = client.db("gardening").collection("shareTips");

    app.get("/gardeners", async (req, res) => {
      const result = await gardenerCollection
        .find({ status: "Active" })
        .limit(6)
        .toArray();
      res.send(result);
    });

    app.get("/tips", async (req, res) => {
      const result = await shareTipsCollection.find().limit(6).toArray();
      res.send(result);
    });

    app.post("/shareTips", async (req, res) => {
      const newTips = req.body;
      const result = await shareTipsCollection.insertOne(newTips);
      res.send(result);
    });

    // browse tips get
    app.get("/shareTips", async (req, res) => {
      const result = await shareTipsCollection
        .find({
          availability: "public",
        })
        .toArray();
      const order = { easy: 1, medium: 2, hard: 3 };
      result.sort(
        (a, b) => (order[a.difficulty] || 4) - (order[b.difficulty] || 4)
      );
      res.send(result);
    });

    // shareTips details
    app.get("/shareTips/:id", async (req, res) => {
      const id = req.params.id;
      const tipDetails = { _id: new ObjectId(id) };
      const result = await shareTipsCollection.findOne(tipDetails);
      res.send(result);
    });

    // update likes from database
    app.patch("/shareTips/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $inc: {
          totalLiked: 1,
        },
      };
      const result = await shareTipsCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.get("/myTips", async (req, res) => {
      const email = req.query.email;
      const myTips = { email: email };
      const result = await shareTipsCollection.find(myTips).toArray();
      res.send(result);
    });
    // update
    app.put("/shareTips/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updatedTips = req.body;
      const updatedDoc = {
        $set: updatedTips,
      };
      const result = await shareTipsCollection.updateOne(
        filter,
        updatedDoc,
        option
      );
      res.send(result);
    });

    // delete
    app.delete("/shareTips/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await shareTipsCollection.deleteOne(query);
      res.send(result);
    });

    // users releted api
    app.post("/users", async (req, res) => {
      const userProfile = req.body;
      const result = await usersCollection.insertOne(userProfile);
      res.send(result);
    });

    // total like count
    app.get("/dashboard/totalLikes", async (req, res) => {
      try {
        const result = await shareTipsCollection
          .aggregate([
            {
              $group: {
                _id: null,
                totalLiked: { $sum: "$totalLiked" },
              },
            },
          ])
          .toArray();

        res.json({ totalLiked: result[0]?.totalLiked || 0 });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch total likes" });
      }
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. Successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("gardening server working");
});

app.listen(port, () => {
  console.groupCollapsed("Server is running successfully", port);
});
