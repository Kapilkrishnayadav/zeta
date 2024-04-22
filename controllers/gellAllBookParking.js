const BookParking = require("../models/BookParking");

exports.getAllBookParking = async (req, res) => {
  try {
    // Fetch all documents from the BookParking collection
    const userDetails = await BookParking.find({});
    res.status(200).json(userDetails);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "An error occurred while fetching documents" });
  }
};