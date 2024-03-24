const express = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
//middleware
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://localhost:5174"],
  })
);
app.use(express.json());
// mongoDB

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.azveb8q.mongodb.net/?retryWrites=true&w=majority`;

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
    const menu = client.db("bistroAgainDB").collection("menu");
    const review = client.db("bistroAgainDB").collection("review");
    // menu
    app.get("/menu", async (req, res) => {
      const category = req.query.category;
      const currentPage = Number(req.query.currentPage);
      const limit = Number(req.query.limit);
      const skip = (currentPage - 1) * limit;

      let categoryObj = {};
      if (category) {
        categoryObj.category = category;
      }
      const total = await menu.countDocuments(categoryObj);
      const result = await menu
        .find(categoryObj)
        .skip(skip)
        .limit(limit)
        .toArray();
      res.send({ result, total });
    });
    // rating
    app.get("/ratings", async (req, res) => {
      const result = await review.find().toArray();
      res.send(result);
    });
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("boss is watching ");
});

app.listen(port, () => {
  console.log(`boss is listening ${port}`);
});
