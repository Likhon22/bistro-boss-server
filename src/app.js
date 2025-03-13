const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// Import routes
const userRoutes = require("./api/users/user.routes");
const menuRoutes = require("./api/menu/menu.routes");
const cartRoutes = require("./api/cart/cart.routes");
const paymentRoutes = require("./api/payment/payment.routes");
const reviewRoutes = require("./api/review/review.routes");
const authRoutes = require("./api/auth/auth.routes");

// Database connection
require("./utils/db");

const app = express();

// Middlewares
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://localhost:5174"],
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/menu", menuRoutes);
app.use("/carts", cartRoutes);
app.use("/payments", paymentRoutes);
app.use("/ratings", reviewRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("boss is watching");
});

module.exports = app;
