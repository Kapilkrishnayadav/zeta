

const ParkingList =require("../models/ParkingList");
exports.postParkingList=(async(req,res)=>{
   
  try {
    const { name, lat, long, address, perhourRate,description,rating, opentime, closeTime,vendorId } = req.body;
    
    // Check if any required field is missing
    if (!req.body.name || !req.body.lat || !req.body.long || !req.body.address || !req.body.perhourRate|| !req.body.description || !req.body.rating || !req.body.opentime || !req.body.closeTime || !req.body.vendorId) {
     
      
       return res.status(400).json({ error: "All fields are required" });

     
    }
    // console.log(req.body)
  
      // Create a new parking entry instance
      const newParking = new ParkingList({ name, lat, long, address, perhourRate,description,rating, opentime, closeTime,vendorId });
  
      // Save the new parking entry to the database
      const savedParking = await newParking.save();
  
      // Send success response
      res.status(201).json({ message: "Parking entry created successfully", parking: savedParking });
    } catch (error) {
      console.error("Error creating parking entry:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
})