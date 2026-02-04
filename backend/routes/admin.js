const express = require("express");
const router = express.Router();
const { Admin, Attraction, GeneralUser, Hotel, HotelBooking, Restaurant, TourismManager } = require("../models/user");
const {
    handleSettings,
    handleAddTourismManager,
    handleDisapproveAttraction,
    handleApproveAttraction,
    handleDisapproveHotel,
    handleApproveHotel,
    handleDisapproveRestaurant,
    handleApproveRestaurant,
    handleDisapproveGeneralUser,
    handleApproveGeneralUser,
    handleDisapproveTourismManager,
    handleApproveTourismManager } = require("../controllers/admin");

router.get("/get-dashboard-info", async(req, res) => {
    try{
        let attractions = await Attraction.find();
        let generalUsers = await GeneralUser.find();
        let hotels = await Hotel.find();
        let restaurants = await Restaurant.find();
        let tourismManagers = await TourismManager.find();
        let hotelBookings = await HotelBooking.find();

        return res.status(200).json({attractions, generalUsers, hotels, restaurants, tourismManagers, hotelBookings});
    }
    catch(error) {
        return res.status(404).json(error);
    }
});

router.get("/get-tourismManagers", async(req, res) => {
    const tourismManagers = await TourismManager.find();

    return res.status(200).json({tourismManagers});
});

router.get("/get-generalUsers", async(req, res) => {
    const generalUsers = await GeneralUser.find();

    return res.status(200).json({generalUsers});
});

router.get("/get-attractions", async(req, res) => {
    const attractions = await Attraction.find();

    return res.status(200).json({attractions});
});

router.get("/get-hotels", async(req, res) => {
    const hotels = await Hotel.find();

    return res.status(200).json({hotels});
});

router.get("/get-restaurants", async(req, res) => {
    const restaurants = await Restaurant.find();

    return res.status(200).json({restaurants});
});

router.post("/settings",
    handleSettings);

router.post("/addTourismManager",
    handleAddTourismManager);

router.post("/disapproveAttraction",
    handleDisapproveAttraction);

router.post("/approveAttraction",
    handleApproveAttraction);

router.post("/disapproveHotel",
    handleDisapproveHotel);

router.post("/approveHotel",
    handleApproveHotel);

router.post("/disapproveRestaurant",
    handleDisapproveRestaurant);

router.post("/approveRestaurant",
    handleApproveRestaurant);

router.post("/disapproveGeneralUser",
    handleDisapproveGeneralUser);

router.post("/approveGeneralUser",
    handleApproveGeneralUser);

router.post("/disapproveTourismManager",
    handleDisapproveTourismManager);

router.post("/approveTourismManager",
    handleApproveTourismManager);
    

module.exports = router;