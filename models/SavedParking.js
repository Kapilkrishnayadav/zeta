const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const savedParkingSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: "Register",
  },

  parkingId: {
    type: Schema.Types.ObjectId,
    unique: true,
    ref: "Parking",
    required: true,
  },
});

savedParkingSchema.index({ userId: 1, parkingId: 1 }, { unique: true });

module.exports = mongoose.model("SavedParking", savedParkingSchema);