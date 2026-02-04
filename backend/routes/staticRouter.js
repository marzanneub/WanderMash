const express = require("express");
const {setUser, getUser} = require("../services/auth");
const { Attraction, Admin, GeneralUser, Hotel, Restaurant, TourismManager } = require("../models/user");

const router = express.Router();

router.get("/must-see-attractions", async(req, res) => {
    const items = await Attraction.find({approved: true}).sort({ clicks: -1 }).limit(4);

    return res.status(200).json({items});
});

router.get("/top-restaurants", async(req, res) => {
    const items = await Restaurant.find({approved: true}).sort({ clicks: -1 }).limit(4);
    
    return res.status(200).json({items});
});

router.get("/popular-hotels", async(req, res) => {
    const items = await Hotel.find({approved: true}).sort({ clicks: -1 }).limit(4);
    
    return res.status(200).json({items});
});

router.get("/get-attractions", async(req, res) => {
    const items = await Attraction.find({approved: true});

    return res.status(200).json({items});
});

router.get("/get-hotels", async(req, res) => {
    const items = await Hotel.find({approved: true});

    return res.status(200).json({items});
});

router.get("/get-restaurants", async(req, res) => {
    const items = await Restaurant.find({approved: true});

    return res.status(200).json({items});
});

router.get("/get-hotel-info", async(req, res) => {

    const hotel = await Hotel.findById(req.query.id);
    // if(hotel) return res.status(200).json({hotel: hotel});
    if(hotel) {
        hotel.clicks+=1;
        await hotel.save();
        return res.status(200).json({hotel: hotel});
    }
    else return res.status(404).json({errormessage: "Error"});
});

router.get("/get-hotel-rooms", async(req, res) => {

    try{
        const hotel = await Hotel.findById(req.query.id);
        if(hotel) return res.status(200).json({roomTypes: hotel.roomTypes});
        else return res.status(404).json({errormessage: "Error"});
    }
    catch(error){
        return res.status(404).json({errormessage: error});
    }
});

router.get("/get-restaurant-info", async(req, res) => {

    const restaurant = await Restaurant.findById(req.query.id);
    // if(restaurant) return res.status(200).json({restaurant: restaurant});
    if(restaurant) {
        restaurant.clicks+=1;
        await restaurant.save();
        return res.status(200).json({restaurant: restaurant});
    }
    else return res.status(404).json({errormessage: "Error"});
});

router.get("/get-attraction-info", async(req, res) => {
    
    let attraction = await Attraction.findById(req.query.id);
    if(attraction) {
        attraction.clicks+=1;
        await attraction.save();
        return res.status(200).json({attraction: attraction});
    }
    else return res.status(404).json({errormessage: "Error"});
});

/////////////////////////Need to handle many types of user in this fucntion///////////////////////////////
router.get("/get-user-info", async(req, res) => {
    const token = getUser(req.cookies.user);
    if(!token) return res.status(404).json(null);

    let user = await Admin.findOne({_id: token._id});
    if(!user) user = await GeneralUser.findOne({_id: token._id});
    if(!user) user = await Hotel.findOne({_id: token._id});
    if(!user) user = await Restaurant.findOne({_id: token._id});
    if(!user) user = await TourismManager.findOne({_id: token._id});
    if(user) return res.status(200).json({user});
    else return res.status(404).json(null);
});

router.get("/get-user-role", async(req, res) => {
    const token = getUser(req.cookies.user);
    if(token) return res.status(200).json(token.role);
    else return res.status(404).json(null);
});


module.exports = router;