const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
  profilePhoto: { type: String},
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  password: { type: String, required: true },
  isVendor:{type:Boolean,required:true},
  isFirst:{type:Boolean,required:true,default:true},
  fcmToken:{type:String,required:true},
});

module.exports = mongoose.model("Register", registerSchema);
