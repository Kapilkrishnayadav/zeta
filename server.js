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
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true
    },
    password: {
      type: String,
      required: true
    }
  });
  
  // Create a model using the schema
  const Register = mongoose.model('Register', RegisterSchema);
  
  
// const register = mongoose.model("register", Register);

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser=require("cookie-parser")
const express = require("express");
const cors = require("cors");
const path = require("path");
const { createRequire } = require("module");
const app = express();

app.use(express.json());
app.use(cors());
app.post("/register", async (req, res) => {
  try {
    // Extract data from the request body
    const { firstName, lastName, dateOfBirth, email, phoneNumber, gender, password } = req.body;

    // Validate incoming data
    if (!firstName || !lastName || !dateOfBirth || !email || !phoneNumber || !gender || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the user already exists in the database
    const existingUser = await Register.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const registerData = await Register.create({
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
    // email="john.doe@example.com"
    // password="hashedpassword123";
    // Validate input
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
    const token = jwt.sign({ id: existingUser._id, email: existingUser.email }, "shhhh", {
      expiresIn: "2h",
    });

    // Omit password from the response
    existingUser.password = undefined;

    // Set cookie with token
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true
    };
    res.cookie("token", token, options);

    // Respond with success and user data along with the JWT token
    res.status(200).json({ success: true, token, user: existingUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while logging in" });
  }
});

app.put("/logout", async (req, res) => {
  try {
    // Clear the token stored on the client-side
    // console.log("hello");
    res.clearCookie("token");

    // Send a response indicating successful logout
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Error while logging out:", error);
    res.status(500).json({ success: false, error: "An error occurred while logging out" });
  }
});

  
const port = process.env.PORT || 3001;
app.listen(port, (err) => {
  if (err) console.log(err);
  console.log("Server started at http://localhost:" + port);
});
