const express = require("express");
const router = express.Router();
const {
    handleUserRegistration,
    handleUserVerification,
    handleUserResendVerificationCode,
    handleForgotPassword,
    handleResetPassword,
    handleUserLogin } = require("../controllers/auth");

router.post("/registration", handleUserRegistration);
router.post("/verification", handleUserVerification);
router.post("/resend-verification-code", handleUserResendVerificationCode);
router.post("/forgot-password", handleForgotPassword);
router.post("/reset-password", handleResetPassword);
router.post("/login", handleUserLogin);

module.exports = router;