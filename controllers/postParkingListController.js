

const ParkingList =require("../models/ParkingList");
exports.postParkingList=(async(req,res)=>{
    console.log()
    try {
        // Create a new parking document based on the request body
        const newParking = await ParkingList.create(req.body);
        res.status(201).json(newParking);
      } catch (error) {
        console.error('Error creating parking:', error);
        res.status(500).json({ error: 'An error occurred while creating parking' });
      }
})