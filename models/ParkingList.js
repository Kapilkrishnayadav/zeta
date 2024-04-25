const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const parkingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lat: { type: Number, required: true },
  long: { type: Number, required: true },
  address: { type: String, required: true },
  perhourRate: { type: Number, required: true }, // Decimal numbers allowed
  description: { type: String },
  rating: { type: Number },
  opentime: { type: String, required: true },
  closeTime: { type: String, required: true },
  userId: {
    type: Schema.Types.ObjectId, // Changed to ObjectId type
    required: true,
    ref:"Register"
  }

});

const Parking = mongoose.model("Parking", parkingSchema);

module.exports = Parking;
