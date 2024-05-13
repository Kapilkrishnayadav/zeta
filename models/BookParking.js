const mongoose = require('mongoose');
// const ParkingList=require("./ParkingList")
const Schema = mongoose.Schema;

// Define schema
const BookParkingSchema = new Schema({
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
    type: Schema.Types.ObjectId, // Changed to ObjectId type
    required: true,
    ref:"Parking"
  },
  status: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref:"Register"
  },
  paymentStatus: {
    type: String,
    required: true
  },
  paidTime:{
    type:String,
    default:"unpaid",
  },
  paidAmount:{
    type:String,
    default:"0",
  },
});

// Create model from schema
const BookParking = mongoose.model('BookParking', BookParkingSchema);

// Export model
module.exports = BookParking;
