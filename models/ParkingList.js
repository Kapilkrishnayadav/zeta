const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lat: { type: Number, required: true },
  long: { type: Number, required: true },
  address: { type: String, required: true },
  perhourRate: { type: Number, required: true }, // Decimal numbers allowed
  description: { type: String },
  rating: { type: Number },
  opentime: { type: String },
  closeTime: { type: String },
});

const Parking = mongoose.model("Parking", parkingSchema);

module.exports = Parking;
