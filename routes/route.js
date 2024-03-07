const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const register= require('../controllers/registerController');
const login=require("../controllers/loginController")
const forgotPassword=require("../controllers/forgotPasswordController")
const getProfile=require("../controllers/getProfileController")
const updateProfile=require("../controllers/updateProfileController")
const resetPassword=require("../controllers/resetPassword")
const token=require("../middlewares/verifyToken")
const socialLogin=require("../controllers/socialLoginController")
const postParkingList=require("../controllers/postParkingListController")
 const getParkingList=require("../controllers/getParkingListController")
const verifyToken=token.verifyToken;
router.post('/register',register.registerUser );
router.post('/login', login.loginUser);
router.post('/forgot-password', forgotPassword.forgotPassword);
router.get('/profile',verifyToken ,getProfile.getProfile);
router.put('/update-profile',verifyToken ,updateProfile.updateProfile);
router.post('/reset-password',resetPassword.resetPassword)
router.post('/social-login', socialLogin.socialLogin);
router.post("/parking-list",postParkingList.postParkingList)
router.get("/parking-list",getParkingList.getParkingList)
module.exports = router;
