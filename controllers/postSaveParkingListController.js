const SavedParking =require("../models/SavedParking")
exports.saveParkingList=(async(req,res)=>{
  const { parkingId } = req.body;
  const userId=req.user.id;


// Validate the presence of required fields
if (!userId || !parkingId) {
  return res.status(400).json({ error: 'userId and parkingId are required' });
}

// Check if a document with the same userId and parkingId already exists
const existingDocument = await SavedParking.findOne({ userId, parkingId });

if (existingDocument) {
  // If a document already exists, delete it
  await SavedParking.deleteOne({ _id: existingDocument._id });
  return res.status(200).json({ message: 'parking unsaved' });
}

// Create a new SavedParking document
const savedParking = new SavedParking({
  userId,
  parkingId
});

// Save the document to the database
savedParking.save().then(() => {
  res.status(201).json({ message: 'Parking saved' });
}).catch((err) => {
  console.error("Error saving parking information", err);
  res.status(500).json({ error: 'An internal server error occurred' });
});
})