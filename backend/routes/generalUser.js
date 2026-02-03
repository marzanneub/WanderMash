const express = require("express");
const router = express.Router();
const {
    handleEditProfile,
    handleSettings,

    handleBkashPayment,
    handleBookHotel,} = require("../controllers/generalUser");

router.post("/editProfile",
    handleEditProfile);

router.post("/settings",
    handleSettings);

router.post("/bkashPayment",
    handleBkashPayment);

router.post("/bookHotel",
    handleBookHotel);

module.exports = router;