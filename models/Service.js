const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true
  },
  service_name: String,
  duration: Number,
  price: Number
}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema);