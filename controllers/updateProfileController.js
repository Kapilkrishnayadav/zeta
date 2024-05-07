const token=require("../middlewares/verifyToken")
const Register=require("../models/Register")
exports.updateProfile=(async(req,res)=>{
    try {
        // Extract data from the request body
        const {
          profilePhoto,
          firstName,
          lastName,
          dateOfBirth,
          email,
          phoneNumber,
          gender,
          password,
          isFirst
        } = req.body;
        console.log(req.body)
        // Validate incoming data (you can adjust the validation based on your requirements)
        if (
          !profilePhoto ||
          !firstName ||
          !lastName ||
          !dateOfBirth ||
          !email ||
          !phoneNumber ||
          !gender
        ) {
          return res
            .status(400)
            .json({ error: "All fields except password are required" });
        }
    
        // Check if the user exists in the database
        const existingUser = await Register.findOne({ email });
        if (!existingUser) {
          return res.status(404).json({ error: "User not found" });
        }
    
        // Update user data
        existingUser.profilePhoto = profilePhoto;
        existingUser.firstName = firstName;
        existingUser.lastName = lastName;
        existingUser.dateOfBirth = new Date(dateOfBirth);
        existingUser.phoneNumber = phoneNumber;
        existingUser.gender = gender;
        existingUser.isFirst=isFirst;
    
        // If password is provided, hash and update it
        console.log(existingUser);
        // Save the updated user document
        await existingUser.save();
    
        // Respond with success message
        res
          .status(200)
          .json({ success: true, message: "Profile updated successfully" });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ error: "An error occurred while updating the profile" });
      }
})