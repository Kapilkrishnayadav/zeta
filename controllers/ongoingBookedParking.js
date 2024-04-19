const Parking = require("../models/BookParking");

exports.ongoingBookedParking = async (req, res) => {
  try {

    const userId = req.user.id;
    const _id = req.body.id; // Assuming the ID is provided in the request body

    // Check if ID is provided in the request body
    if (!_id) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    // Find and update the parking entry by ID and user ID
    const updatedParking = await Parking.findOneAndUpdate(
      { _id, userId }, // Filter
      { $set: { status: "ongoing" } }, // Update
      { new: true } // Return the updated document
    );

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
