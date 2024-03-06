const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  otp: { type: Number, required: true },
  otpExpiry: { type: Date, required: true },
  email: { type: String, required: true }
});

module.exports = mongoose.model('OTP', otpSchema);
