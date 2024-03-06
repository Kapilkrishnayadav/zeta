const mongoose = require("mongoose");
// require("./connectDb/conn")
const { ObjectId } = require("mongodb");
const Register = require('./models/Register');
const OTP = require('./models/OTP');
mongoose.set("strictQuery", true);
mongoose
  .connect(
    "mongodb+srv://yadavkapil2336:yadav2@cluster0.ek5syoj.mongodb.net/placementproject"
  )
  .then(() => {
    console.log("running succesfully");
  })
  .catch((err) => {
    console.log(err);
  });
const Schema = mongoose.Schema;


const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const path = require("path");
const nodemailer = require("nodemailer");
const { createRequire } = require("module");
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors());
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Assuming the token is in the format "Bearer <token>"

    jwt.verify(token, "shhhh", (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized" });
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
app.get("/profile", verifyToken, async (req, res) => {
  try {
    // Extract user ID from decoded token
    const userId = req.user.id;
    // console.log(userId)

    // Fetch user profile data from the database using userId
    const userProfile = await Register.findById(userId);

    if (!userProfile) {
      return res.status(404).json({ error: "User profile not found" });
    }

    // Omit sensitive data like password before sending the response
    userProfile.password = undefined;

    // Respond with success and user profile data
    res.status(200).json({ success: true, userProfile });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching user profile" });
  }
});

app.post("/register", async (req, res) => {
  try {
    // Extract data from the request body
    const {
      profilePhoto,
      firstName,
      lastName,
      dateOfBirth,
      email,
      phoneNumber,
      gender,
      password,
    } = req.body;

    // Validate incoming data
    if (
      !profilePhoto ||
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !email ||
      !phoneNumber ||
      !gender ||
      !password
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the user already exists in the database
    const existingUser = await Register.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const registerData = await Register.create({
      profilePhoto,
      firstName,
      lastName,
      dateOfBirth: new Date(dateOfBirth), // Ensure date of birth is converted to Date type
      email,
      phoneNumber,
      gender,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign({ id: registerData._id, email }, "shhhh", {
      expiresIn: "2h",
    });

    // Omit password from the response
    registerData.password = undefined;

    // Respond with success and user data along with the JWT token
    res.status(201).json({ success: true, registerData, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while saving the data" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email
    const existingUser = await Register.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      "shhhh",
      {
        expiresIn: "2h",
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
});

app.put("/update-profile", verifyToken, async (req, res) => {
  try {
    // Extract data from the request body
    const {
      profilePhoto,
      firstName,
      lastName,
      dateOfBirth,
      email,
      phoneNumber,
      gender,
      password,
    } = req.body;

    // Validate incoming data (you can adjust the validation based on your requirements)
    if (
      !profilePhoto ||
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !email ||
      !phoneNumber ||
      !gender
    ) {
      return res
        .status(400)
        .json({ error: "All fields except password are required" });
    }

    // Check if the user exists in the database
    const existingUser = await Register.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user data
    existingUser.profilePhoto = profilePhoto;
    existingUser.firstName = firstName;
    existingUser.lastName = lastName;
    existingUser.dateOfBirth = new Date(dateOfBirth);
    existingUser.phoneNumber = phoneNumber;
    existingUser.gender = gender;

    // If password is provided, hash and update it
    console.log(existingUser);
    // Save the updated user document
    await existingUser.save();

    // Respond with success message
    res
      .status(200)
      .json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the profile" });
  }
});
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  console.log(email);
  // Check if user exists
  const user = await Register.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate OTP and send to user's email
  const otp = Math.floor(1000 + Math.random() * 9000);
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

  try {
    const otpData = await OTP.create({
      otpExpiry: new Date(otpExpiry), // Ensure date of birth is converted to Date type
      email: email,
      otp: otp,
    });
    console.log('OTP created successfully:', otpData);
    // Handle success scenario here
  } catch (error) {
    console.error('Error creating OTP:', error.message);
    // Handle error scenario here
  }
  

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yadavkapil2336@gmail.com",
      pass: "ughcahijsktyaxqc",
    },
  });

  const mailOptions = {
    from: "yadavkapil2336@gmail.com",
    to: email,
    subject: "OTP Verification",
    text: `Your OTP for password reset is ${otp}. Expires in 10 minutes.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: "Error sending email", error });
    }
    res.status(200).json({ message: "OTP sent to email" });
  });
});

app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    // Find OTP document in database
    const otpData = await OTP.findOne({otp });
    if (!otpData) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    // OTP found, check if it's expired
    if (otpData.otpExpiry < new Date()) {
      return res.status(400).json({ error: 'OTP has expired' });
    }
    // OTP is valid
    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error.message);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

app.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    // Check if the user with the provided email exists
    const user = await Register.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Update the user's password in the database
    await Register.updateOne({ email }, { $set: { password: hashedPassword } });
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error resetting password:', error.message);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

app.post("/social-login", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email
    const existingUser = await Register.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      "shhhh",
      {
        expiresIn: "2h",
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
});
// Assuming you have a User model imported and your app setup for Express

// API endpoint to fetch profile data using JWT token from cookies

const port = process.env.PORT || 3001;
app.listen(port, (err) => {
  if (err) console.log(err);
  console.log("Server started at http://localhost:" + port);
});
