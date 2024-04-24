const BookParking = require("../../models/BookParking");
const ParkingList = require("../../models/ParkingList");
const Register = require("../../models/Register");

exports.getVendorBookedParking = async (req, res) => {
  try {
    const userId = req.user.id;
    const {status}=req.body;

    // Fetch parkingIds based on userId
    const parkingIds = await ParkingList.find({ userId }, 'parkingId');
    const parkingIdsArray = parkingIds.map(parking => parking._id);

    // Aggregate booked parking details and join with user details
    let bookedParkingDetails;
    if(status === "all")
    {

       bookedParkingDetails = await BookParking.aggregate([
        {
          $match: {
            parkingId: { $in: parkingIdsArray },
          },
        },
        {
          $lookup: {
            from: "registers",
            let: { userId: "$userId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$userId"] },
                },
              },
              {
                $project: {
                  _id: 0,
                  firstName: 1,
                  lastName: 1,
                  phoneNumber: 1,
                },
              },
            ],
            as: "customerDetail",
          },
        },
      ]);
    }
    else
    {
      bookedParkingDetails = await BookParking.aggregate([
        {
          $match: {
            parkingId: { $in: parkingIdsArray },
            status:status
          },
        },
        {
          $lookup: {
            from: "registers",
            let: { userId: "$userId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$userId"] },
                },
              },
              {
                $project: {
                  _id: 0,
                  firstName: 1,
                  lastName: 1,
                  phoneNumber: 1,
                },
              },
            ],
            as: "customerDetail",
          },
        },
      ]);
    }

    res.json({ bookedParkingDetails });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
