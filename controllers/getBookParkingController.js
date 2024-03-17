const BookParking = require("../models/BookParking");

exports.getBookParking = async (req, res) => {
    try {
        // Fetch all parking entries from the database
        const parkingEntries = await BookParking.find();
        res.status(200).json({ parkingEntries });
    } catch (err) {
        console.error('Error fetching parking entries:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
