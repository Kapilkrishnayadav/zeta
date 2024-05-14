
const Parking = require("../models/ParkingList");

exports.getSingleParkingList = async (req, res) => {
    try {
        // Fetch all parking documents from the database
        const userId = req.user.id; // Assuming userId is available in the request
        const { parkingId } = req.query; // Corrected destructuring
        console.log(parkingId)
        const parking = await Parking.findById(parkingId);
        res.status(200).json(parking);
    } catch (error) {
        console.error('Error fetching parking document:', error);
        res.status(500).json({ error: 'An error occurred while fetching parking documents' });
    }
};
