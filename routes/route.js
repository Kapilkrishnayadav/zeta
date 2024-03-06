const express = require('express');
const router = express.Router();
const resgisterController = require('../controllers/register');

router.post('/register',resgisterController.registerUser );
// router.post('/login', authController.loginUser);
// router.post('/forgot-password', authController.forgotPassword);
// router.post('/reset-password', authController.resetPassword);

module.exports = router;
