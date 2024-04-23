const BookParking = require("../models/BookParking");
const ParkingList = require("../models/ParkingList");

exports.getBookParking = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming userId is available in the request
    console.log(userId);
    const { status } = req.query;
    let bookedParking;

    if (status === "all") {
      bookedParking = await BookParking.aggregate([
        {
          $match: {
            userId: userId,
          },
        },
        {
          $lookup: {
            from: "parkings",
            localField: "parkingId",
            foreignField: "_id",
            as: "parkingDetail",
          },
        },
      ]);
    } else {
      bookedParking = await BookParking.aggregate([
        {
          $match: {
            userId: userId,
            status: status,
          },
        },
        {
          $lookup: {
            from: "parkings",
            localField: "parkingId",
            foreignField: "_id",
            as: "parkingDetail",
          },
        },
      ]);
    }
console.log(bookedParking);
    if (!bookedParking || bookedParking.length === 0) {
      return res.status(404).json({ error: "No combined data found" });
    }

    res.status(200).json({ bookedParking });
  } catch (error) {
    console.error("Error combining data:", error);
    res.status(500).json({ error: "An error occurred while processing the request" });
  }
};