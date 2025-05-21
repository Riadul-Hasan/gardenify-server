const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nttz9vg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});




async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const gardenerCollection = client.db('gardening').collection("gardeners")
    const tipsCollection = client.db('gardening').collection('tips')
    const usersCollection = client.db('gardening').collection("users")
    const shareTipsCollection = client.db('gardening').collection('shareTips')

   

    app.get("/gardeners", async (req, res) => {
  const result = await gardenerCollection.find({ status: "Active" }).limit(6).toArray();
  res.send(result);
});

    app.get("/tips", async (req, res)=>{
        const result = await tipsCollection.find().limit(6).toArray();
        res.send(result)
    })


    app.post("/shareTips", async (req, res)=>{
        const newTips = req.body;
        const result = await shareTipsCollection.insertOne(newTips)
        res.send(result)
    })
    
    app.get("/shareTips", async(req, res)=>{
        const result = await shareTipsCollection.find({
        availability: "public"}).toArray()
        res.send(result)
    })

  

    // users releted api
    app.post("/users", async(req, res)=>{
        const userProfile = req.body;
        const result = await usersCollection.insertOne(userProfile)
        res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);












app.get("/", (req, res)=>{
    res.send("gardening server working")
})


app.listen(port, ()=>{
    console.groupCollapsed("Server is running successfully", port)
})