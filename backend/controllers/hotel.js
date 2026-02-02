const multer = require("multer");
const util = require("util");
const bcrypt = require ("bcrypt");
const { Admin, Attraction, GeneralUser, Hotel, Restaurant, TourismManager } = require("../models/user");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        return cb(null, "./public/images");
    },
    filename: function(req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage }).fields([
    { name: "logo", maxCount: 1 },
    { name: "image", maxCount: 1 },
]);
const uploadAsync = util.promisify(upload);

/////////////////////////Need to handle many types of user in this fucntion///////////////////////////////
async function handleEditProfile(req, res) {
    await uploadAsync(req, res);

    const logo = req.files?.logo?.[0]?.filename || null;

    const updates = {...req.body};

    let result =  await GeneralUser.findOne({ phone: updates.phone });
    if(!result) result =  await Attraction.findOne({phone: updates.phone });
    if(!result) result =  await Hotel.findOne({ _id: { $ne: req.userData._id },  phone: updates.phone });
    if(!result) result =  await Restaurant.findOne({phone: updates.phone });
    if(!result) result =  await TourismManager.findOne({phone: updates.phone });
    if(result){ return res.status(409).json({errormessage: "Phone number already exists"}); }

    result =  await Hotel.findOne({ _id: { $ne: req.userData._id },  registrationId: updates.registrationId });
    if(result){ return res.status(409).json({errormessage: "Registration ID already exists"}); }

    updates.socialLinks = JSON.parse(updates.socialLinks);
    updates.facilities = JSON.parse(updates.facilities);
    updates.views = JSON.parse(updates.views);
    updates.policies = JSON.parse(updates.policies);
    updates.location = JSON.parse(updates.location);

    await Hotel.findByIdAndUpdate({_id: req.userData._id}, { $set: updates });
    if(logo!=null) await Hotel.findOneAndUpdate({_id: req.userData._id}, {logo: logo});

    return res.status(200).json({successmessage: "Successfully Updated"});

}

async function handleSettings(req, res) {
    await uploadAsync(req, res);
    const { password, newPassword, confirmPassword } = req.body;

    const user = await Hotel.findOne({ _id: req.userData._id});
    
    if(password.length) {
        if(bcrypt.compareSync(password, user.password)==false) return res.status(401).json({errormessage: "Current password is invalid"});
        const hash = bcrypt.hashSync(newPassword, 10);
        await Hotel.findOneAndUpdate({_id: user._id}, {password: hash});
    }
    
    return res.status(201).json({successmessage: "Successfully settings updated"});
}

async function handleUploadImage(req, res) {
    await uploadAsync(req, res);

    const image = req.files?.image?.[0]?.filename || null;

    if(image!=null) await Hotel.findByIdAndUpdate(req.userData._id,{ $push: { images: image } });

    return res.status(200).json({successmessage: "Successfully Uploaded", imageTitle: image});
}

async function handleSetAsDp(req, res) {
    await uploadAsync(req, res);

    if(req.body.image) {
        await Hotel.findByIdAndUpdate(req.userData._id,{ dp: req.body.image });
        return res.status(200).json({successmessage: "Display picture updated successfully."});
    }
    return res.status(404).json({errormessage: "Error"});
}

async function handleDeleteImage(req, res) {
    await uploadAsync(req, res);


    if(req.body.image) {
        await Hotel.findByIdAndUpdate(req.userData._id,{$pull:{ images: req.body.image }});
        return res.status(200).json({successmessage: "Image deleted successfully."});
    }
    return res.status(404).json({errormessage: "Error"});
}

async function handleAddRoomTypes(req, res) {
    await uploadAsync(req, res);

    room = {
        title: req.body.title,
        pricePerNight: req.body.pricePerNight,
        roomSize: req.body.roomSize,
        capacity: JSON.parse(req.body.capacity),
        bedConfig: JSON.parse(req.body.bedConfig),
    };

    try{
        await Hotel.findByIdAndUpdate(
            req.userData._id,
            { $push: { roomTypes: room } }
        );

        return res.status(200).json({successmessage: "Room type added successfully"});
    }
    catch(error){
        return res.status(200).json({errormessage: "error"});
    }


}

async function handleEditRoomTypes(req, res) {
    await uploadAsync(req, res);

    const updateData = {
        "roomTypes.$.title": req.body.title,
        "roomTypes.$.pricePerNight": JSON.parse(req.body.pricePerNight),
        "roomTypes.$.capacity": JSON.parse(req.body.capacity),
        "roomTypes.$.bedConfig": JSON.parse(req.body.bedConfig),
        "roomTypes.$.roomSize": JSON.parse(req.body.roomSize),
        "roomTypes.$.furnishings": JSON.parse(req.body.furnishings),
        "roomTypes.$.amenities": JSON.parse(req.body.amenities),
        "roomTypes.$.description": req.body.description,
    };

    try{
        const updatedHotel = await Hotel.findOneAndUpdate(
            { 
                _id: req.userData._id,
                "roomTypes._id": req.body.id
            },
            { $set: updateData }
        );

        if(updatedHotel) return res.status(200).json({ successmessage: "Room updated successfully" });
        else return res.status(409).json({ errormessage: "Error" });
    }
    catch(error){
        return res.status(409).json({ errormessage: error });
    }
}

async function handleDeleteRoomTypes(req, res) {
    await uploadAsync(req, res);
    
    try{
        const user = await Hotel.findOne({_id: req.userData._id});
        const targetRoomTypes = user.roomTypes.find(item => item._id.toString() === req.body.id)

        if(targetRoomTypes.rooms.length > 0) return res.status(409).json({ errormessage: "Please delete all the rooms of this type first." });
    }
    catch(error){
        return res.status(409).json({ errormessage: error });
    }
    
    try{
        const result = await Hotel.updateOne(
            { _id: req.userData._id },
            { $pull: { roomTypes: { _id: req.body.id } } }
        );

        if(result) return res.status(200).json({ successmessage: "Room deleted successfully" });
        else return res.status(409).json({ errormessage: "Error" });
    }
    catch(error){
        return res.status(409).json({ errormessage: error });
    }
}

async function handleUploadRoomImage(req, res) {
    await uploadAsync(req, res);

    const image = req.files?.image?.[0]?.filename || null;

    if(image!=null) {
        try{
            const updatedHotel = await Hotel.findOneAndUpdate(
                { 
                    _id: req.userData._id,
                    "roomTypes._id": req.body.id
                },
                { $push: { "roomTypes.$.images": image } }
            );

            if(updatedHotel) return res.status(200).json({ successmessage: "Successfully Uploaded", imageTitle: image});
            else return res.status(409).json({ errormessage: "Error" });
        }
        catch(error){
            return res.status(409).json({ errormessage: error });
        }
    }

    return res.status(200).json({errormessage: "Error"});
}

async function handleSetAsRoomDp(req, res) {
    await uploadAsync(req, res);

    if(req.body.image) {
        try{
            const updatedHotel = await Hotel.findOneAndUpdate(
                { 
                    _id: req.userData._id,
                    "roomTypes._id": req.body.id
                },
                { "roomTypes.$.dp": req.body.image }
            );

            if(updatedHotel) return res.status(200).json({ successmessage: "Display picture updated successfully"});
            else return res.status(409).json({ errormessage: "Error" });
        }
        catch(error){
            return res.status(409).json({ errormessage: error });
        }


        // await Hotel.findByIdAndUpdate(req.userData._id,{ dp: req.body.image });
        // return res.status(200).json({successmessage: "Display picture updated successfully."});
    }
    return res.status(404).json({errormessage: "Error"});
}

async function handleDeleteRoomImage(req, res) {
    await uploadAsync(req, res);

    if(req.body.image) {
        try{
            const updatedHotel = await Hotel.findOneAndUpdate(
                { 
                    _id: req.userData._id,
                    "roomTypes._id": req.body.id
                },
                { $pull: { "roomTypes.$.images": req.body.image } }
            );

            if(updatedHotel) return res.status(200).json({ successmessage: "Successfully Deleted", imageTitle: req.body.image});
            else return res.status(409).json({ errormessage: "Error" });
        }
        catch(error){
            return res.status(409).json({ errormessage: error });
        }


        // await Hotel.findByIdAndUpdate(req.userData._id,{$pull:{ images: req.body.image }});
        // return res.status(200).json({successmessage: "Image deleted successfully."});
    }
    return res.status(404).json({errormessage: "Error"});
}


async function handleAddRooms(req, res) {
    await uploadAsync(req, res);

    try{
        const found = await Hotel.findOne({ 
            _id: req.userData._id, 
            roomTypes: {
                $elemMatch: {
                    "rooms.roomNumber": req.body.roomNumber
                }
            }
        });

        if(found) return res.status(409).json({ errormessage: "This number already exists"});
    }
    catch(error){
        return res.status(409).json({ errormessage: error });
    }

    try{
        const updatedHotel = await Hotel.findOneAndUpdate(
            { 
                _id: req.userData._id,
                "roomTypes._id": req.body.id
            },
            { $push: { "roomTypes.$.rooms": {roomNumber: req.body.roomNumber} } }
        );

        if(updatedHotel) return res.status(200).json({ successmessage: "Successfully added"});
        else return res.status(409).json({ errormessage: "Error" });
    }
    catch(error){
        return res.status(409).json({ errormessage: error });
    }
}

async function handleToggleRoomAvility(req, res) {
    await uploadAsync(req, res);
    
    const roomNumber = JSON.parse(req.body.roomNumber);
    const isAvailable = JSON.parse(req.body.isAvailable);
    
    try{
        const updatedHotel = await Hotel.findOneAndUpdate(
            { 
                _id: req.userData._id,
                "roomTypes.rooms.roomNumber": roomNumber
            },
            { 
                $set: { "roomTypes.$.rooms.$[room].isAvailable": isAvailable } 
            },
            { arrayFilters: [{ "room.roomNumber": roomNumber }] }
        );

        if(updatedHotel) return res.status(200).json({ successmessage: "Successfully updated"});
        else return res.status(409).json({ errormessage: "Error" });
    }
    catch(error){
        return res.status(409).json({ errormessage: error });
    }
}

module.exports = {
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
    handleToggleRoomAvility,
};