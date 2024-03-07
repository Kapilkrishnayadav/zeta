const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Register = require('../models/Register');
exports.registerUser = async (req, res) => {
  try {
    // Extract data from the request body
    const { profilePhoto, firstName, lastName, dateOfBirth, email, phoneNumber, gender, password } = req.body;

    // Validate incoming data
    if (!profilePhoto || !firstName || !lastName || !dateOfBirth || !email || !phoneNumber || !gender || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if the user already exists in the database
    const existingUser = await Register.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const newUser = await Register.create({
      profilePhoto, firstName, lastName, dateOfBirth, email, phoneNumber, gender, password: hashedPassword
    });

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id, email }, 'shhhh', { expiresIn: '2h' });

    // Respond with success and user data along with the JWT token
    res.status(201).json({ success: true, user: newUser, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while registering the user' });
  }
};
