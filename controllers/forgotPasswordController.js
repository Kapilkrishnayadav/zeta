const Register=require("../models/Register")
const OTP=require("../models/OTP")
const nodemailer = require("nodemailer");
exports.forgotPassword=(async(req,res)=>{
    const { email } = req.body;
  console.log(email);
  // Check if user exists
  const user = await Register.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate OTP and send to user's email
  const otp = Math.floor(1000 + Math.random() * 9000);
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

  try {
    const otpData = await OTP.create({
      otpExpiry: new Date(otpExpiry), // Ensure date of birth is converted to Date type
      email: email,
      otp: otp,
    });
    console.log('OTP created successfully:', otpData);
    // Handle success scenario here
  } catch (error) {
    console.error('Error creating OTP:', error.message);
    // Handle error scenario here
  }
  

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yadavkapil2336@gmail.com",
      pass: "ughcahijsktyaxqc",
    },
  });

  const mailOptions = {
    from: "yadavkapil2336@gmail.com",
    to: email,
    subject: "OTP Verification",
    text: `Your OTP for password reset is ${otp}. Expires in 10 minutes.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: "Error sending email", error });
    }
    res.status(200).json({ message: "OTP sent to email" });
  });
})