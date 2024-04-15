const BookParking = require("../models/BookParking");

exports.getBookParking = async (req, res) => {
  try {
    // Get the status parameter from the request body
    const { status } = req.body;

    // Fetch all parking entries from the database with the specified status
    let parkingEntries;
    if (status === "all") {
      parkingEntries = await BookParking.find();
    } else {
      parkingEntries = await BookParking.find({ status });
    }

    res.status(200).json({ parkingEntries });
  } catch (err) {
    console.error("Error fetching parking entries:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};