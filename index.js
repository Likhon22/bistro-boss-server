const express = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const stripe = require("stripe")(process.env.Stripe_Secret_Key);
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;

//middleware
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://localhost:5174"],
  })
);
app.use(express.json());
app.use(cookieParser());

// own middleware
const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "unauthorized access" });
    }
    req.user = decoded;
    next();
  });
};

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
    const paymentCollection = client.db("bistroAgainDB").collection("payment");
    // verifyAdmin
    const verifyAdmin = async (req, res, next) => {
      const user = req.user;
      const query = { email: user?.email };
      const result = await userCollection.findOne(query);
      if (!result || result?.role !== "Admin") {
        return res.status(401).send({ message: "unauthorized access" });
      }
      next();
    };
    // jwt
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN, {
        expiresIn: "1h",
      });
      // console.log(user, token);
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    });
    // clear cookie
    app.get("/logout", async (req, res) => {
      res.clearCookie("token").send({ success: true });
    });
    // post menu
    app.post("/menu", async (req, res) => {
      const menuItem = req.body;
      const result = await menuCollection.insertOne(menuItem);
      res.send(result);
    });
    //get menu
    app.get("/menu", verifyToken, async (req, res) => {
      const category = req.query.category;
      const currentPage = Number(req.query.currentPage);
      const limit = Number(req.query.limit);
      const skip = (currentPage - 1) * limit;
      const sortField = req.query.sortField;
      const sortType = req.query.sortType;
      const sortObj = {};

      if (sortField && sortType) {
        sortObj[sortField] = sortType;
      }
      console.log(sortObj);
      let categoryObj = {};
      if (category) {
        categoryObj.category = category;
      }
      const total = await menuCollection.countDocuments(categoryObj);
      const result = await menuCollection
        .find(categoryObj)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .toArray();
      res.send({ result, total });
    });

    // get menu for admin
    app.get("/menu/:email", verifyToken, verifyToken, async (req, res) => {
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
    //  review by user email
    app.get("/ratings/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await reviewCollection.find(query).toArray();
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

    app.get("/users", verifyToken, verifyAdmin, async (req, res) => {
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
    app.put("/users/:email", verifyToken, verifyAdmin, async (req, res) => {
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
    app.get("/carts/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const sortField = req.query.sortField;
      const sortType = req.query.sortType;
      console.log(sortField, sortType);
      const sortObj = {};
      if (sortField && sortType) {
        sortObj[sortField] = sortType;
      }
      const result = await cartCollection.find(query).sort(sortObj).toArray();
      res.send(result);
    });
    // delete cartItem
    app.delete("/carts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });
    // payment
    app.post("/create-payment-intent", async (req, res) => {
      const { price } = req.body;
      const amount = parseInt(price * 100);
      console.log(amount);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });
    // saving payment and deleting the cart
    app.post("/payments", async (req, res) => {
      const paymentInfo = req.body;
      console.log(paymentInfo);
      // carefully deleted the cart
      const query = {
        _id: {
          $in: paymentInfo.cartIds.map((id) => new ObjectId(id)),
        },
      };
      const deletedResult = await cartCollection.deleteMany(query);

      const result = await paymentCollection.insertOne(paymentInfo);
      res.send({ result, deletedResult });
    });
    // payment history for user
    app.get("/payments/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      console.log(email, query);
      const result = await paymentCollection.find(query).toArray();
      res.send(result);
    });

    // stats for admin
    app.get("/admin-stats", verifyToken, verifyAdmin, async (req, res) => {
      const products = await menuCollection.estimatedDocumentCount();
      const customer = await userCollection.estimatedDocumentCount();
      const order = await paymentCollection.estimatedDocumentCount();
      // const payments = await paymentCollection.find().toArray();
      // const revenue = payments.reduce((total, item) => total + item.price, 0);
      const result = await paymentCollection
        .aggregate([
          {
            $group: {
              _id: null,
              totalRevenue: {
                $sum: "$price",
              },
            },
          },
        ])
        .toArray();
      const revenue = result.length > 0 ? result[0].totalRevenue : 0;

      res.send({ products, customer, order, revenue });
    });
    // order-stats
    app.get("/order-stats", verifyToken, verifyAdmin, async (req, res) => {
      const result = await paymentCollection
        .aggregate([
          {
            $unwind: "$menuItemIds",
          },
          {
            $lookup: {
              from: "menu",
              localField: "menuItemIds",
              foreignField: "_id",
              as: "menuItems",
            },
          },
          {
            $unwind: "$menuItems",
          },
          {
            $group: {
              _id: "$menuItems.category",
              quantity: {
                $sum: 1,
              },
              revenue: {
                $sum: "$menuItems.price",
              },
            },
          },
          {
            $project: {
              category: "$_id",
              _id: 0,
              quantity: "$quantity",
              revenue: "$revenue",
            },
          },
        ])
        .toArray();
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
