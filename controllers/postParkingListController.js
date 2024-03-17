

const ParkingList =require("../models/ParkingList");
exports.postParkingList=(async(req,res)=>{
   
    try {
      const { name, lat, long, address, perhourRate, saved, opentime, closeTime } = req.body;
  
      // Check if any required field is missing
      if (!name || !lat || !long || !address || !perhourRate || !saved || !opentime || !closeTime) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      // Create a new parking entry instance
      const newParking = new ParkingList({ name, lat, long, address, perhourRate, saved, opentime, closeTime });
  
      // Save the new parking entry to the database
      const savedParking = await newParking.save();
  
      // Send success response
      res.status(201).json({ message: "Parking entry created successfully", parking: savedParking });
    } catch (error) {
      console.error("Error creating parking entry:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
})