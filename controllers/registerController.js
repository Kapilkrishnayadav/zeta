const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Register = require('../models/Register');
exports.registerUser = async (req, res) => {
  try {
    // Extract data from the request body
    const { profilePhoto, firstName, lastName, dateOfBirth, email, phoneNumber, gender, password,isVendor } = req.body;

    // Validate incoming data
    // console.log(req.body);
    if (!profilePhoto || !firstName || !lastName || !dateOfBirth || !email || !phoneNumber || !gender || !password) {
      console.log("fields required");
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check if the user already exists in the database
    const existingUser = await Register.findOne({ email });
    if (existingUser) {
      console.log("email exists")
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const newUser = await Register.create({
      profilePhoto, firstName, lastName, dateOfBirth, email, phoneNumber, gender, password, isVendor
    });

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id, email }, 'shhhh', { expiresIn: '24h' });

    // Respond with success and user data along with the JWT token
    res.status(201).json({ success: true, user: newUser, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while registering the user' });
  }
};
