const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
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

const RegisterSchema = new Schema({
  profilePhoto: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Create a model using the schema
const Register = mongoose.model("Register", RegisterSchema);

// const register = mongoose.model("register", Register);

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const path = require("path");
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

app.put("/update-profile", verifyToken, async (req, res) => {
  try {
    const userId = req.user.email;
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

// Assuming you have a User model imported and your app setup for Express

// API endpoint to fetch profile data using JWT token from cookies

const port = process.env.PORT || 3001;
app.listen(port, (err) => {
  if (err) console.log(err);
  console.log("Server started at http://localhost:" + port);
});
