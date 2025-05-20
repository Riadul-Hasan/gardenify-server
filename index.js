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

const data = 
    [
  {
  
    "name": "Lara Green",
    "specialty": "Organic Vegetable Gardener",
    "location": "San Francisco, CA",
    "experience": 8,
    "status": "Active",
    "profileImage": "https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    "bio": "Passionate about sustainable organic vegetables & educating newbies.",
    "contact": {
      "phone": "555-123-4567",
      "email": "lara.green@example.com"
    }
  },
  {
 
    "name": "Carlos Flores",
    "specialty": "Ornamental & Landscape Design",
    "location": "Miami, FL",
    "experience": 12,
    "status": "Active",
    "profileImage": "https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    "bio": "Expert in creating lush gardens and outdoor spaces that breathe life.",
    "contact": {
      "phone": "555-987-6543",
      "email": "carlos.flores@example.com"
    }
  },
  {

    "name": "Mei Lin",
    "specialty": "Herbal & Medicinal Gardens",
    "location": "Seattle, WA",
    "experience": 6,
    "status": "Active",
    "profileImage": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    "bio": "Crafting healing herbal gardens and teaching herbal remedies.",
    "contact": {
      "phone": "555-222-3344",
      "email": "mei.lin@example.com"
    }
  },
  {

    "name": "John Doe",
    "specialty": "Fruit Orchard & Tree Care",
    "location": "Austin, TX",
    "experience": 10,
    "status": "Active",
    "profileImage": "https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    "bio": "Dedicated to orchard management and fruit tree health.",
    "contact": {
      "phone": "555-321-5678",
      "email": "john.doe@example.com"
    }
  },
  {

    "name": "Aisha Patel",
    "specialty": "Urban Gardening & Container Planting",
    "location": "New York, NY",
    "experience": 4,
    "status": "Active",
    "profileImage": "https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    "bio": "Urban gardener transforming small spaces into green havens.",
    "contact": {
      "phone": "555-444-5566",
      "email": "aisha.patel@example.com"
    }
  },
  {
    
    "name": "Tom Baker",
    "specialty": "Sustainable Permaculture",
    "location": "Portland, OR",
    "experience": 15,
    "status": "Active",
    "profileImage": "https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    "bio": "Permaculture designer creating eco-friendly and self-sufficient gardens.",
    "contact": {
      "phone": "555-777-8888",
      "email": "tom.baker@example.com"
    }
  },
  {
    "name": "Inactive Gardener",
    "specialty": "Flower & Rose Gardening",
    "location": "Denver, CO",
    "experience": 7,
    "status": "Inactive",
    "profileImage": "https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    "bio": "Loves cultivating beautiful flowers and roses.",
    "contact": {
      "phone": "555-555-5555",
      "email": "inactive.gardener@example.com"
    }
  },
  {
    "name": "Inactive Gardener 2",
    "specialty": "Vegetable Art & Edible Landscaping",
    "location": "Chicago, IL",
    "experience": 3,
    "status": "Inactive",
    "profileImage": "https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    "bio": "Creating edible landscapes with a touch of art.",
    "contact": {
      "phone": "555-666-7777",
      "email": "inactive2@example.com"
    }
  },
  {
 
    "name": "Inactive Gardener 3",
    "specialty": "Native Plants & Eco-Gardening",
    "location": "Boise, ID",
    "experience": 5,
    "status": "Inactive",
    "profileImage": "https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    "bio": "Promoting native plants and eco-friendly practices.",
    "contact": {
      "phone": "555-888-9999",
      "email": "inactive3@example.com"
    }
  }
]


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const gardenerCollection = client.db('gardening').collection("gardeners")
    const usersCollection = client.db('gardening').collection("users")

    // app.get("/gardeners", async (req, res)=>{
    //     const result = await gardenerCollection.find().toArray()
    //     res.send(result)
    // })

    app.get("/gardeners", async (req, res) => {
  const result = await gardenerCollection.find({ status: "Active" }).limit(6).toArray();
  res.send(result);
});

  

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