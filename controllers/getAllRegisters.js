const Register=require("../models/Register")

exports.getAllRegister = async (req, res) => {
  try {
    // Fetch all parking documents from the database
    const { user } = req.query;
    if (user === "vendor") {
      const userDetails = await Register.find({ isVendor: true });
      res.status(200).json(userDetails);
    } else {
      const userDetails = await Register.find({ isVendor: false });
      res.status(200).json(userDetails);
    }
  } catch (error) {
    console.error('Error fetching parking documents:', error);
    res.status(500).json({ error: 'An error occurred while fetching parking documents' });
  }
}