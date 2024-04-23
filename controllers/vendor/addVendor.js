

const Register =require("../../models/Register");
exports.addVendor=(async(req,res)=>{
 
  try {
    const { profilePhoto, firstName, lastName, dateOfBirth, email,phoneNumber,gender, password, isVendor } = req.body;
    
    // Check if any required field is missing
    if (!req.body.profilePhoto || !req.body.firstName || !req.body.lastName || !req.body.dateOfBirth || !req.body.email|| !req.body.phoneNumber || !req.body.gender || !req.body.password) {
     
      console.log(req.body.closeTime);
       return res.status(400).json({ error: "All fields are required" });

     
    }
    // console.log(req.body)
  
      // Create a new parking entry instance
      const newParking = new ParkingList({ profilePhoto,firstName,lastName,dateOfBirth,email,phoneNumber,gender,password,isVendor });
  
      // Save the new parking entry to the database
      const savedParking = await newParking.save();
  
      // Send success response
      res.status(201).json({ message: "Parking entry created successfully", parking: savedParking });
    } catch (error) {
      console.error("Error creating parking entry:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
})