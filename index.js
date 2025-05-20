const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())














app.get("/", (req, res)=>{
    res.send("gardening server working")
})


app.listen(port, ()=>{
    console.groupCollapsed("Server is running successfully", port)
})