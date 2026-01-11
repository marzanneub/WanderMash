const express = require("express");
const router = express.Router();
const { Admin, TourismManager } = require("../models/user");
const {
    handleSettings,
    handleAddTourismManager,
    handleDisapproveTourismManager,
    handleApproveTourismManager } = require("../controllers/admin");


router.get("/get-tourismManagers", async(req, res) => {
    const tourismManagers = await TourismManager.find();

    return res.status(200).json({tourismManagers});
});

router.post("/settings",
    handleSettings);

router.post("/addTourismManager",
    handleAddTourismManager);

router.post("/disapproveTourismManager",
    handleDisapproveTourismManager);

router.post("/approveTourismManager",
    handleApproveTourismManager);

module.exports = router;