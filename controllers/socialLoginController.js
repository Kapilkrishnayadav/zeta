const Register=require("../models/Register")
const jwt = require("jsonwebtoken");
exports.socialLogin=(async(req,res)=>{
    try {
        const { email } = req.body;
    
        if (!email) {
          return res.status(400).json({ error: "Email and password are required" });
        }
    
        // Find user by email
        const existingUser = await Register.findOne({ email });
    
        if (!existingUser) {
          return res.status(404).json({ error: "User not found" });
        }
    
        // Generate JWT token
        const token = jwt.sign(
          { id: existingUser._id, email: existingUser.email },
          "shhhh",
          {
            expiresIn: "2h",
          }
        );
    
        // Omit password from the response
        existingUser.password = undefined;
    
        // Respond with success and user data along with the JWT token
        res.status(200).json({ success: true, token, user: existingUser });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while logging in" });
      }
})












