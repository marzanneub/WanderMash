const express = require("express");
const { Admin, TourismManager } = require("../models/user");

const router = express.Router();

router.get("/get-tourismManagers", async(req, res) => {
    const tourismManagers = await TourismManager.find();

    return res.status(200).json({tourismManagers});
});


module.exports = router;