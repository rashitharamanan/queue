const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth");

const {
  registerVendor,
  loginVendor,
  setupShop
} = require("../controllers/vendorController");

/* ===============================
   AUTH ROUTES
================================ */

// Register Vendor
router.post("/register", registerVendor);

// Login Vendor
router.post("/login", loginVendor);


/* ===============================
   PROTECTED ROUTES
================================ */

// Setup Shop (requires login)
router.post("/setup-shop", verifyToken, setupShop);


/* ===============================
   LOGOUT
================================ */

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

module.exports = router;