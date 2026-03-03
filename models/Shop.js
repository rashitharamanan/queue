const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true
  },
  shop_name: String,
  category: String,
  phone: String,
  description: String,
  address: String,
  city: String,
  pincode: String,
  latitude: Number,
  longitude: Number,
  opening_time: String,
  closing_time: String,
  working_days: [String],
  avg_service_time: Number
}, { timestamps: true });

module.exports = mongoose.model("Shop", shopSchema);