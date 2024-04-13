const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SuperAdmin = require('../models/SuperAdmin');

exports.loginSuperAdmin = async (req, res) => {
  try {
      const { username, password } = req.body;
console.log(username);
      if (!username || !password) {
          return res.status(400).json({ error: "Username and password are required" });
      }

    //   Find user by username
      const existingUser = await SuperAdmin.findOne({ username });

      if (!existingUser) {
          return res.status(404).json({ error: "User not found" });
      }


      // Generate JWT token
      const token = jwt.sign(
          { id: existingUser._id, username: existingUser.username },
          "shhhh",
          {
              expiresIn: "2h",
          }
      );

      // Set token as a cookie
      res.cookie('token', token, { httpOnly: true, maxAge: 2 * 60 * 60 * 1000 }); // 2 hours expiration

      // Omit password from the response
      existingUser.password = undefined;

      // Respond with success and user data along with the JWT token
      res.status(200).json({ success: true, token, user: existingUser });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while logging in" });
  }
};