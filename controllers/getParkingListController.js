const Parking=require("../models/ParkingList")

exports.getParkingList=(async(req,res)=>{
    try {
        // Fetch all parking documents from the database
        const allParking = await Parking.find();
        res.status(200).json(allParking);
      } catch (error) {
        console.error('Error fetching parking documents:', error);
        res.status(500).json({ error: 'An error occurred while fetching parking documents' });
      }
})