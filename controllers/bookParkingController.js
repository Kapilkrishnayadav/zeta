const mongoose = require('mongoose');
 // Import ObjectId from mongoose

const BookParking = require("../models/BookParking");

exports.bookParking = async (req, res) => {
  try {
    // Convert req.user.id to ObjectId if it's not already
    const userId = req.user.id;
    
    // Set the user ID in the request body
    req.body.userId = userId;

    // Create a new parking document
    const newParking = new BookParking(req.body);

    // Save the document to the database
    await newParking.save();

    res.status(201).json({ message: 'Parking entry created successfully', parking: newParking });
  } catch (err) {
    console.error('Error creating parking entry:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
