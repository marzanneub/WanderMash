const express = require("express");
const router = express.Router();

const {
    handleEditProfile,
    handleSettings,

    handleUploadImage,
    handleSetAsDp,
    handleDeleteImage } = require("../controllers/hotel");

router.post("/editProfile", handleEditProfile);
router.post("/settings", handleSettings);

router.post("/uploadImage", handleUploadImage);
router.post("/setAsDp", handleSetAsDp);
router.post("/deleteImage", handleDeleteImage);

module.exports = router;