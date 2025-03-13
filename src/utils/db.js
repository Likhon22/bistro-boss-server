const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.azveb8q.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Collections
const collections = {};

async function connectDB() {
  try {
    await client.connect();

    // Initialize collections
    collections.menuCollection = client.db("bistroAgainDB").collection("menu");
    collections.reviewCollection = client
      .db("bistroAgainDB")
      .collection("review");
    collections.userCollection = client.db("bistroAgainDB").collection("user");
    collections.cartCollection = client.db("bistroAgainDB").collection("cart");
    collections.paymentCollection = client
      .db("bistroAgainDB")
      .collection("payment");

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
}

connectDB();

module.exports = {
  client,
  collections,
};
