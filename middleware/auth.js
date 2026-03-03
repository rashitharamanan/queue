const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.verifyToken = (req, res, next) => {
  try {
    // 1️⃣ Get token from cookies
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided."
      });
    }

    // 2️⃣ Verify using ENV secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Attach user data to request
    req.user = decoded;

    next();

  } catch (error) {
    console.error("JWT Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token."
    });
  }
};