const mongoose = require("mongoose");
// Import ObjectId from mongoose
const ParkingList = require("../models/ParkingList");
const Register = require("../models/Register");
const BookParking = require("../models/BookParking");
const admin = require("firebase-admin");
exports.bookParking = async (req, res) => {
  try {
    // Convert req.user.id to ObjectId if it's not already
    
    let userId = req.user.id;
    const parkingId = req.body.parkingId;
    if(req.body.paidAmount==null)
    {
      // console.log("hello");
      req.body.paidAmount="0";
    }
    if(req.body.paidTime==null)
    {
      req.body.paidTime="null";
    }
   
    if (!parkingId) {
      return res.status(404).json({ error: "Parking not found" });
    }
    req.body.userId = userId.toString();
    const parkingDetail = await ParkingList.findById(parkingId);
    const vendorId = parkingDetail.userId;
    userId= vendorId;
    const register = await Register.findOne(userId);
    
    // console.log(register);


    // Create a new parking document
    const newParking = new BookParking(req.body);

    // Save the document to the database
    await newParking.save();
    // console.log(newParking._id.toString());
    req.body._id=newParking._id.toString();
    //  newParking.parkingId=newParking.parkingId.toString();
    //  newParking.userId=newParking.userId.toString();
    console.log(req.body);
  console.log(newParking);

    const message = {
      notification: {
        title: "New Notification",
        body: "Accept the booking of parking",
      },
      data:req.body,
      token: register.fcmToken,
    };

    admin
      .messaging()
      .send(message)
      .then((response) => {
        console.log("Successfully sent message:", response);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });

    // Set the user ID in the request body

   
    res
      .status(201)
      .json({
        message: "Parking entry created successfully",
        parking: newParking,
      });
  } catch (err) {
    console.error("Error creating parking entry:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
