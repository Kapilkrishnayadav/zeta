const mongoose = require("mongoose");
require("./connectDb/conn");


const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");

const route = require("./routes/route");
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use("/api", route);

// Assuming you have a User model imported and your app setup for Express

// API endpoint to fetch profile data using JWT token from cookies

const port = process.env.PORT || 3001;
app.listen(port, (err) => {
  if (err) console.log(err);
  console.log("Server started at http://localhost:" + port);
});
