const express = require("express");
const router = express.Router();
const { GeneralUser } = require("../models/user");
const { HotelBooking } = require("../models/booking");
const {
    handleEditProfile,
    handleSettings,

    handleBkashPayment,
    handleBookHotel,
    handleCancelHotelBooking,} = require("../controllers/generalUser");

router.post("/editProfile", handleEditProfile);
router.post("/settings", handleSettings);

router.post("/bkashPayment", handleBkashPayment);
router.post("/bookHotel", handleBookHotel);
router.post("/cancelHotelBooking", handleCancelHotelBooking);

router.get("/get-my-info", async(req, res) => {
    try{
        let user = await GeneralUser.findById(req.userData._id);
        let bookings = await HotelBooking.find({userId: req.userData._id}).populate({
            path: "hotelId",
            model: "hotel",
            select: "name district area address policies"
        }).sort({ createdAt: -1 });
        
        if(bookings) return res.status(200).json({bookings, user});
    }
    catch(error) {
        return res.status(404).json(error);
    }
});

module.exports = router;