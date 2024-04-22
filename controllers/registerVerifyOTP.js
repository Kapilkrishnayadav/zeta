const OTP =require("../models/OTP")
exports.registerVerifyOTP=async(req,res)=>{
    const { email, otp } = req.body;
  try {
    // Find OTP document in database
    const otpData = await OTP.findOne({email,otp });
    if (!otpData) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    // OTP found, check if it's expired
    if (otpData.otpExpiry < new Date()) {
      return res.status(400).json({ error: 'OTP has expired' });
    }
    // OTP is valid
    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error.message);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
}