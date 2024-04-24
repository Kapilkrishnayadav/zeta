const BookParking = require("../../models/BookParking");
const ParkingList = require("../../models/ParkingList");
const Register=require("../../models/Register")

exports.getVendorBookedParking = async (req, res) => {
  try {
    // const { userId } = req.user.id;
    const userId = req.user.id;
    
    // Fetch limited fields (name and number) based on userId
    const user = await Register.findOne({ userId }, 'firstName lastName phoneNumber');
    
    // // Fetch parkingIds based on userId
    const parkingIds = await ParkingList.find({ userId }, 'parkingId');
    // console.log(parkingIds);
    
    const parkingIdsArray = parkingIds.map(parking => parking._id);
    // // Fetch booked parking details based on parkingIds
    // const bookedParkingDetails = await BookParking.aggregate([
    //   { $match: { parkingId: { $in: parkingIdsArray } } }
    // ]);
    console.log(parkingIdsArray)
    const bookedParkingDetails = await BookParking.find({ parkingId: { $in: parkingIdsArray } })
    console.log(bookedParkingDetails);
    res.json({ user,bookedParkingDetails });
    // res.json({ user, parkingIds, bookedParkingDetails });
} catch (err) {
    res.status(500).json({ error: err.message });
}
};