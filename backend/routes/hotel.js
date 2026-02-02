const express = require("express");
const router = express.Router();
const { Hotel } = require("../models/user");

const {
    handleEditProfile,
    handleSettings,

    handleUploadImage,
    handleSetAsDp,
    handleDeleteImage,

    handleAddRoomTypes,
    handleEditRoomTypes,
    handleDeleteRoomTypes,

    handleUploadRoomImage,
    handleSetAsRoomDp,
    handleDeleteRoomImage,

    handleAddRooms,
    handleToggleRoomAvility,} = require("../controllers/hotel");

router.post("/editProfile", handleEditProfile);
router.post("/settings", handleSettings);

router.post("/uploadImage", handleUploadImage);
router.post("/setAsDp", handleSetAsDp);
router.post("/deleteImage", handleDeleteImage);

router.post("/addRoomTypes", handleAddRoomTypes);
router.post("/editRoomTypes", handleEditRoomTypes);
router.post("/deleteRoomTypes", handleDeleteRoomTypes);

router.post("/uploadRoomImage", handleUploadRoomImage);
router.post("/setAsRoomDp", handleSetAsRoomDp);
router.post("/deleteRoomImage", handleDeleteRoomImage);

router.post("/addRooms", handleAddRooms);
router.post("/toggleRoomAvility", handleToggleRoomAvility);

router.get("/get-roomType", async(req, res) => {
    
    const hotel = await Hotel.findById(req.userData._id);
    
    const roomType = hotel.roomTypes.find((room) => room._id.toString() === req.query.id);

    if(roomType){
        return res.status(200).json({roomType: roomType});
    }
    else return res.status(404).json({errormessage: "Not found"});
});

module.exports = router;