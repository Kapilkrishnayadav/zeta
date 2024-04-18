const SavedParking=require("../models/SavedParking")

exports.savedParking = async (req, res) => {
  try {
    const savedParkings = await SavedParking.find().populate("parkingId");
    res.json(savedParkings);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
