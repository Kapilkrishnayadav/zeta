const Parking = require("../models/ParkingList");
const SavedParking = require("../models/SavedParking"); // Assuming you have a model named SavedParking for saved parking

exports.getParkingList = async (req, res) => {
    try {
      const userId = req.user.id;
        // Fetch all parking documents from the database
        const allParking = await Parking.find();

        // Fetch all saved parking documents from the database
        const savedParking = await SavedParking.find({userId});

        // Create a map of saved parking IDs for quick lookup
        const savedParkingIds = savedParking.map(saved => saved.parkingId.toString());

        // Map through all parking documents and mark each as saved or unsaved
        const parkingWithSavedStatus = allParking.map(parking => {
            // Check if the parking id exists in savedParkingIds
            const isSaved = savedParkingIds.includes(parking._id.toString());
            return { ...parking._doc, isSaved }; // Append a property to indicate if it's saved
        });

        res.status(200).json(parkingWithSavedStatus);
    } catch (error) {
        console.error('Error fetching parking documents:', error);
        res.status(500).json({ error: 'An error occurred while fetching parking documents' });
    }
};
