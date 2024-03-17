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
 const searchParkingList=require("../controllers/searchParkingListController")
 const bookParking=require("../controllers/bookParkingController")
 const getBookParking=require("../controllers/getBookParkingController")
 const getSavedParking=require("../controllers/getSavedParkingController")
 const putSaveParkingList=require("../controllers/putSaveParkingListController")
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
router.get("/search-parking-list",searchParkingList.searchParkingList)
router.post("/book-parking",bookParking.bookParking)
router.get("/book-parking",getBookParking.getBookParking)
router.get("/saved-parking",getSavedParking.savedParking)
router.put("/save-button",putSaveParkingList.saveParkingList)

module.exports = router;
