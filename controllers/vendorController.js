const Shop = require("../models/Shop");
const Service = require("../models/Service");
const Vendor = require("../models/Vendor");   
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); 
exports.setupShop = async (req, res) => {
  try {
   const vendorId = req.user?.id;
    const { shop, services } = req.body;

    // 🔎 Validation
    if (!shop || !shop.shop_name || !shop.phone || !shop.category) {
      return res.status(400).json({ message: "Missing required shop fields" });
    }

    if (!services || services.length === 0) {
      return res.status(400).json({ message: "At least one service required" });
    }

    // 🏪 Check if vendor already created shop
    const existingShop = await Shop.findOne({ vendorId });
    if (existingShop) {
      return res.status(400).json({ message: "Shop already exists for this vendor" });
    }

    // 🏪 Create Shop
    const newShop = await Shop.create({
      vendorId,
      shop_name: shop.shop_name,
      category: shop.category,
      phone: shop.phone,
      description: shop.description,
      address: shop.address,
      city: shop.city,
      pincode: shop.pincode,
      latitude: shop.latitude,
      longitude: shop.longitude,
      opening_time: shop.opening_time,
      closing_time: shop.closing_time,
      working_days: shop.working_days,
      avg_service_time: shop.avg_service_time
    });

    // 🛠 Create Services
    const serviceDocs = services.map(service => ({
      shopId: newShop._id,
      service_name: service.service_name,
      duration: service.duration,
      price: service.price
    }));

    await Service.insertMany(serviceDocs);

    res.status(201).json({
      success: true,
      message: "Shop setup completed successfully",
      shopId: newShop._id
    });

  } catch (err) {
    console.error("Setup Shop Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



exports.registerVendor = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const vendor = await Vendor.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      message: "Vendor registered successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: vendor._id, email: vendor.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: "Login successful"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};