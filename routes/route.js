const express = require('express');
const router = express.Router();
const registerVerifyOTP=require("../controllers/registerVerifyOTP")
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
 const getSingleBookedParking=require("../controllers/getSingleBookedParking")
 const getSingleParkingList=require("../controllers/getSingleParkingList")
 const postSaveParkingList=require("../controllers/postSaveParkingListController")
 const loginSuperAdmin=require("../controllers/loginSuperAdminController")
 const cancelParking=require("../controllers/cancelParkingController")
 const ongoingBookedParking=require("../controllers/ongoingBookedParking")
 const completedParking=require("../controllers/completedParkingController")
 const deleteParkingList=require("../controllers/deleteParkingList");
const { getAllRegister } = require('../controllers/getAllRegisters');
const deleteRegisters= require("../controllers/deleteRegisters")
const getAllBookParking=require("../controllers/gellAllBookParking")
const getVendorBookedParking=require("../controllers/vendor/getVendorBookedParking")
const editEndDateTime=require("../controllers/editEndDateTime")
const verifyToken=token.verifyToken;
router.post('/verifyOTP',registerVerifyOTP.registerVerifyOTP );
router.post('/register',register.registerUser );
router.post('/register',register.registerUser );
router.get('/all-registers', getAllRegister );
router.post('/login', login.loginUser);
router.post('/forgot-password', forgotPassword.forgotPassword);
router.get('/profile',verifyToken ,getProfile.getProfile);
router.put('/update-profile',verifyToken ,updateProfile.updateProfile);
router.post('/reset-password',resetPassword.resetPassword)
router.post('/social-login', socialLogin.socialLogin);
router.post("/parking-list",postParkingList.postParkingList)
router.get("/parking-list",verifyToken,getParkingList.getParkingList)
router.delete("/register",deleteRegisters.deleteRegisters)
router.delete("/parking-list",deleteParkingList.deleteParkingList)
router.get("/search-parking-list",searchParkingList.searchParkingList)
router.post("/book-parking",verifyToken,bookParking.bookParking)
router.get("/book-parking",verifyToken,getBookParking.getBookParking)
router.get("/single-book-parking",verifyToken,getSingleBookedParking.getSingleBookedParking)
router.get("/single-parkingList",verifyToken,getSingleParkingList.getSingleParkingList)
router.put("/cancel-parking",verifyToken,cancelParking.cancelParking)
router.put("/ongoing-parking",verifyToken,ongoingBookedParking.ongoingBookedParking)
router.put("/completed-parking",verifyToken,completedParking.completedParking)
router.get("/saved-parking",verifyToken,getSavedParking.savedParking)
router.post("/save-button",verifyToken,postSaveParkingList.saveParkingList)
router.post("/super-admin-login",loginSuperAdmin.loginSuperAdmin)
router.get("/booked-parking",verifyToken,getVendorBookedParking.getVendorBookedParking)
router.get("/get-all-book-parking",getAllBookParking.getAllBookParking)
router.put("/editEndDateTime",editEndDateTime.editEndDateTime)

module.exports = router;
