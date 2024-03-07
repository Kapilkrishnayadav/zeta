const Register=require("../models/Register")

exports.getProfile=(async(req,res)=>{
    try {
        // Extract user ID from decoded token
        const userId = req.user.id;
        // console.log(userId)
    
        // Fetch user profile data from the database using userId
        const userProfile = await Register.findById(userId);
    
        if (!userProfile) {
          return res.status(404).json({ error: "User profile not found" });
        }
    
        // Omit sensitive data like password before sending the response
        userProfile.password = undefined;
    
        // Respond with success and user profile data
        res.status(200).json({ success: true, userProfile });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ error: "An error occurred while fetching user profile" });
      }
})