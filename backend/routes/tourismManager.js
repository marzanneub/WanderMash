const express = require("express");
const router = express.Router();
const { TourismManager } = require("../models/user");
const {
    handleSettings } = require("../controllers/tourismManager");

router.post("/settings",
    handleSettings);

module.exports = router;