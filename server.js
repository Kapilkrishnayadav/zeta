const mongoose = require("mongoose");
require("./connectDb/conn");


const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const app = express();
// app.use(cors());

app.use(cors());

const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app); // assuming 'app' is your existing Express app
const io = socketIo(server,{cors: {
  origin:["http://localhost:5173",
  "https://zeta-admin.vercel.app"],
  credentials: true ,
},
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle event sent from customer side
  socket.on("customerEvent", (data) => {
      console.log("Received event from customer:", data);

      // Emit the event to admin side
      io.emit("adminEvent", data);
  });

  socket.on("disconnect", () => {
      console.log("A user disconnected");
  });
});




const route = require("./routes/route");
app.use(cookieParser());
app.use(express.json());

app.use("/api", route);

// Assuming you have a User model imported and your app setup for Express

// API endpoint to fetch profile data using JWT token from cookies

const port = process.env.PORT || 3001;
server.listen(port, (err) => {
  if (err) console.log(err);
  console.log("Server started at http://localhost:" + port);
});
