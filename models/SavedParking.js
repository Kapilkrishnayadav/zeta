const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const savedParkingSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Register",
  },
  parkingId: {
    type: Schema.Types.ObjectId,
    ref: "Parking",
  },
});

module.exports = mongoose.model("SavedParking", savedParkingSchema);
