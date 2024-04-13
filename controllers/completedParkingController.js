const Parking=require("../models/BookParking");
exports.completedParking=(async(req,res)=>{
    try {
        const { id } = req.body;
    
        // Check if ID is provided in the request body
        if (!id) {
          return res.status(400).json({ error: "Invalid request body" });
        }
    
        // Find the parking entry by ID
        const bookParking = await Parking.findById(id);
        if (!bookParking) {
          return res.status(404).json({ error: "Parking entry not found" });
        }
    
        // Toggle the saved status
        bookParking.status = "completed";
    
        // Save the updated parking entry
        await bookParking.save();
    
        // Send success response
        res.status(200).json({ message: "Parking entry saved status toggled successfully", parking: bookParking });
      } catch (error) {
        console.error("Error toggling parking entry saved status:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    
})