
const BookParking = require("../models/BookParking");

exports.getSingleBookedParking = async (req, res) => {
    try {
        // Fetch all parking documents from the database
        const userId = req.user.id; // Assuming userId is available in the request
        const { bookingId } = req.query; // Corrected destructuring
        // console.log(bookingId)
        const parking = await BookParking.findById(bookingId);
        res.status(200).json(parking);
    } catch (error) {
        console.error('Error fetching parking document:', error);
        res.status(500).json({ error: 'An error occurred while fetching parking documents' });
    }
};
