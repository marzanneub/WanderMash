const express = require("express");
const router = express.Router();

const {
    handleEditProfile,
    handleUploadImage,
    handleSetAsDp,
    handleDeleteImage,
    handleAddMenuItem,
    handleEditMenuItem,
    handleDeleteMenuItem,
    handleSettings } = require("../controllers/restaurant");

router.post("/editProfile", handleEditProfile);
router.post("/settings", handleSettings);
router.post("/uploadImage", handleUploadImage);
router.post("/setAsDp", handleSetAsDp);
router.post("/deleteImage", handleDeleteImage);
router.post("/addMenuItem", handleAddMenuItem);
router.post("/editMenuItem", handleEditMenuItem);
router.post("/deleteMenuItem", handleDeleteMenuItem);

module.exports = router;