const Parking = require("../models/BookParking");
const Register=require("../models/Register")
const admin = require("firebase-admin");
exports.updateParkingStatus = async (req, res) => {
  try {
    // const userId = req.user.id;
    const _id = req.body._id; // Assuming the ID is provided in the request body
    const parkingStatus=req.body.parkingStatus;
    const userId= req.user.userId;
    const register = await Register.findOne(userId);
    // Check if ID is provided in the request body
    if (!_id) {

      return res.status(400).json({ error: "Invalid request body" });
    }

    if(parkingStatus==="rejected")
    {
        const updatedStatus = await Parking.findOneAndUpdate(
            { _id}, // Filter
            { $set: { status:"cancelled" } }, // Update
            { new: true } // Return the updated document
          );
    }
//  console.log("Kapil"); 
    // Find and update the parking entry by ID and user ID
    const updatedParking = await Parking.findOneAndUpdate(
      { _id}, // Filter
      { $set: { parkingStatus } }, // Update
      { new: true } // Return the updated document
    );

    const message = {
      notification: {
        title: "New Notification",
        body: "Booking "+parkingStatus,
      },
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


    // Check if parking entry is found
    if (!updatedParking) {
      return res.status(404).json({ error: "Parking entry not found" });
    }

    // Send success response with the updated parking entry
    res.status(200).json({
      message: "Parking entry status updated successfully",
      parking: updatedParking,
    });
  } catch (error) {
    console.error("Error updating parking entry status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
