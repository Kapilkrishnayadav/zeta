const ParkingList = require("../models/ParkingList");

exports.savedParking = async (req, res) => {
  try {
    // Fetch data of saved documents from the database
    const savedParking = await ParkingList.find({ saved: true });
    res.status(200).json({ parkingData: savedParking });
  } catch (error) {
    console.error("Error fetching saved documents:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
