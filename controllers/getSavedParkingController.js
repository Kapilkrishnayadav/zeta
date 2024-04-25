const SavedParking=require("../models/SavedParking")

exports.savedParking = async (req, res) => {
  // const { parkingId } = req.body;
  const {userId}=req.user.id;
  try {
    const savedParkings = await SavedParking.find(userId).populate("parkingId");
    res.json(savedParkings);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
