const express = require("express");
const router = express.Router();
const { TourismManager, Attraction } = require("../models/user");
const {
    handleSettings,
    handleAddAttraction } = require("../controllers/tourismManager");

router.get("/my-added-attractions", async(req, res) => {
    const attractions = await Attraction.find({createdBy: req.userData._id});

    return res.status(200).json({attractions});
});

router.post("/settings",
    handleSettings);
router.post("/addAttraction",
    handleAddAttraction);

module.exports = router;