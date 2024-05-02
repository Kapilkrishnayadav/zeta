const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Register = require('../models/Register');


exports.loginUser = async(req, res) => {
   
    try {
        const { email, password } = req.body;
    
        if (!email || !password) {
          return res.status(400).json({ error: "Email and password are required" });
        }
    
        // Find user by email
        const existingUser = await Register.findOne({ email,password });
    
        if (!existingUser) {
          return res.status(404).json({ error: "User not found" });
        }
    
        // Compare passwords
        // const passwordMatch = await bcrypt.compare(password, existingUser.password);
        // if (!passwordMatch) {
        //   return res.status(401).json({ error: "Invalid password" });
        // }
    
        // Generate JWT token
        const token = jwt.sign(
          { id: existingUser._id, email: existingUser.email },
          "shhhh",
          {
            expiresIn: "24h",
          }
        );
    
        // Omit password from the response
        existingUser.password = undefined;
    
        // Respond with success and user data along with the JWT token
        res.status(200).json({ success: true, token, user: existingUser });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while logging in" });
      }
  };