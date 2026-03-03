const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const vendorRoutes = require("./routes/vendor");

const app = express();

/* ===============================
   MIDDLEWARE
================================ */

// Parse JSON
app.use(express.json());

// Parse Cookies
app.use(cookieParser());

// CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

/* ===============================
   ROUTES
================================ */

app.use("/api/vendor", vendorRoutes);

/* ===============================
   HEALTH CHECK ROUTE
================================ */

app.get("/", (req, res) => {
  res.send("Queue Management Backend Running 🚀");
});

/* ===============================
   GLOBAL ERROR HANDLER (Optional)
================================ */

app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

module.exports = app;