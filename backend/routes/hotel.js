const express = require("express");
const router = express.Router();

const {
    handleEditProfile,
    handleSettings } = require("../controllers/hotel");

router.post("/editProfile", handleEditProfile);
router.post("/settings", handleSettings);

module.exports = router;