const express = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const menuCollection = client.db("bistroAgainDB").collection("menu");
    const reviewCollection = client.db("bistroAgainDB").collection("review");
    const userCollection = client.db("bistroAgainDB").collection("user");
    const cartCollection = client.db("bistroAgainDB").collection("cart");

    // post menu
    app.post("/menu", async (req, res) => {
      const menuItem = req.body;
      const result = await menuCollection.insertOne(menuItem);
      res.send(result);
    });
    //get menu
    app.get("/menu", async (req, res) => {
      const category = req.query.category;
      const currentPage = Number(req.query.currentPage);
      const limit = Number(req.query.limit);
      const skip = (currentPage - 1) * limit;

      let categoryObj = {};
      if (category) {
        categoryObj.category = category;
      }
      const total = await menuCollection.countDocuments(categoryObj);
      const result = await menuCollection
        .find(categoryObj)
        .skip(skip)
        .limit(limit)
        .toArray();
      res.send({ result, total });
    });
    // get menu for admin
    app.get("/menu/:email", async (req, res) => {
      const email = req.params.email;
      const query = { adminEmail: email };
      console.log(email);
      const result = await menuCollection.find(query).toArray();
      res.send(result);
    });
    // deleteMenu
    app.delete("/menu/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await menuCollection.deleteOne(query);
      res.send(result);
    });
    // updateMenu
    app.put("/menu/:id", async (req, res) => {
      const id = req.params.id;
      const menuItem = req.body;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: menuItem,
      };
      const result = await menuCollection.updateOne(query, updateDoc, options); 
      res.send(result);
    });
    // rating
    app.get("/ratings", async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    });
    // post rating
    app.post("/ratings", async (req, res) => {
      const ratingInfo = req.body;
      const result = await reviewCollection.insertOne(ratingInfo);
      res.send(result);
    });

    // saveUser
    app.post("/users/:email", async (req, res) => {
      const user = req.body;
      const email = req.params.email;
      const role = req.body.role;
      const query = { email: email };
      const isExist = await userCollection.findOne(query);
      if (isExist) {
        return res.send(isExist);
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
      // const result = await userCollection.insertOne(user);
      // res.send(result);
    });
    // get user

    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await userCollection.findOne(query);
      res.send(result);
    });
    // update user role
    app.put("/users/:email", async (req, res) => {
      const user = req.body;
      const email = req.params.email;
      const query = { email: email };
      console.log(user, email, query);
      const updateDoc = {
        $set: {
          role: user.role,
        },
      };
      console.log(updateDoc);
      const result = await userCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    // cart
    app.post("/carts", async (req, res) => {
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem);
      res.send(result);
    });
    app.get("/carts/:email", async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });
    // delete cartItem
    app.delete("/carts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    //  Connect the client to the server	(optional starting in v4.7)
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
