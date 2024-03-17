const Parking=require("../models/ParkingList");
exports.saveParkingList=(async(req,res)=>{
    try {
        const { id } = req.body;
    
        // Check if ID is provided in the request body
        if (!id) {
          return res.status(400).json({ error: "Invalid request body" });
        }
    
        // Find the parking entry by ID
        const parkingEntry = await Parking.findById(id);
        if (!parkingEntry) {
          return res.status(404).json({ error: "Parking entry not found" });
        }
    
        // Toggle the saved status
        parkingEntry.saved = !parkingEntry.saved;
    
        // Save the updated parking entry
        await parkingEntry.save();
    
        // Send success response
        res.status(200).json({ message: "Parking entry saved status toggled successfully", parking: parkingEntry });
      } catch (error) {
        console.error("Error toggling parking entry saved status:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    
})