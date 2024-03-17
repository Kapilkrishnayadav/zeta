// Import necessary modules
const mongoose = require('mongoose');

// Define schema
const BookParkingSchema = new mongoose.Schema({
  typeOfVehicle: {
    type: String,
    required: true
  },
  vehicleNo: {
    type: String,
    required: true
  },
  startDateTime: {
    type: Date,
    required: true
  },
  endDateTime: {
    type: Date,
    required: true
  },
  nameOfVehicle: {
    type: String,
    required: true
  },
  parkingId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  }
});

// Create model from schema
const BookParking = mongoose.model('BookParking', BookParkingSchema);

// Export model
module.exports = BookParking;
