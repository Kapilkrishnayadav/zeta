const BookParking=require("../models/BookParking")

exports.bookParking=(async(req,res)=>{
    try {
        // Create a new parking document
        const newParking = new BookParking(req.body);
        // Save the document to the database
        await newParking.save();
        res.status(201).json({ message: 'Parking entry created successfully', parking: newParking });
      } catch (err) {
        console.error('Error creating parking entry:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
})