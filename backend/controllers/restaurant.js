const multer = require("multer");
const util = require("util");
const bcrypt = require ("bcrypt");
const { Admin, Attraction, GeneralUser, Restaurant, TourismManager } = require("../models/user");

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
    // console.log(updates);

    let result =  await GeneralUser.findOne({ phone: updates.phone });
    if(!result) result =  await Attraction.findOne({phone: updates.phone });
    if(!result) result =  await Restaurant.findOne({ _id: { $ne: req.userData._id },  phone: updates.phone });
    if(!result) result =  await TourismManager.findOne({phone: updates.phone });
    if(result){ return res.status(409).json({errormessage: "Phone number already exists"}); }

    result =  await Restaurant.findOne({ _id: { $ne: req.userData._id },  registrationId: updates.registrationId });
    if(result){ return res.status(409).json({errormessage: "Registration ID already exists"}); }

    updates.socialLinks = JSON.parse(updates.socialLinks);
    updates.facilities = JSON.parse(updates.facilities);
    updates.cuisines = JSON.parse(updates.cuisines);
    updates.openingHours = JSON.parse(updates.openingHours);
    updates.location = JSON.parse(updates.location);

    await Restaurant.findByIdAndUpdate({_id: req.userData._id}, { $set: updates });
    if(logo!=null) await Restaurant.findOneAndUpdate({_id: req.userData._id}, {logo: logo});

    return res.status(200).json({successmessage: "Successfully Updated"});
}

async function handleSettings(req, res) {
    await uploadAsync(req, res);
    const { password, newPassword, confirmPassword } = req.body;

    const user = await Restaurant.findOne({ _id: req.userData._id});
    
    if(password.length) {
        if(bcrypt.compareSync(password, user.password)==false) return res.status(401).json({errormessage: "Current password is invalid"});
        const hash = bcrypt.hashSync(newPassword, 10);
        await Restaurant.findOneAndUpdate({_id: user._id}, {password: hash});
    }
    
    return res.status(201).json({successmessage: "Successfully settings updated"});
}

async function handleUploadImage(req, res) {
    await uploadAsync(req, res);

    const image = req.files?.image?.[0]?.filename || null;

    if(image!=null) await Restaurant.findByIdAndUpdate(req.userData._id,{ $push: { images: image } });

    return res.status(200).json({successmessage: "Successfully Uploaded", imageTitle: image});
}

async function handleSetAsDp(req, res) {
    await uploadAsync(req, res);

    if(req.body.image) {
        await Restaurant.findByIdAndUpdate(req.userData._id,{ dp: req.body.image });
        return res.status(200).json({successmessage: "Display picture updated successfully."});
    }
    return res.status(404).json({errormessage: "Error"});
}

async function handleDeleteImage(req, res) {
    await uploadAsync(req, res);


    if(req.body.image) {
        await Restaurant.findByIdAndUpdate(req.userData._id,{$pull:{ images: req.body.image }});
        return res.status(200).json({successmessage: "Image deleted successfully."});
    }
    return res.status(404).json({errormessage: "Error"});
}

async function handleAddMenuItem(req, res) {
    await uploadAsync(req, res);

    const image = req.files?.image?.[0]?.filename || null;

    if(image!=null) {
        item = {
            image: image,
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            description: req.body.description,
        };
        // await Restaurant.findOneAndUpdate({_id: user._id}, {logo: logo});

        await Restaurant.findByIdAndUpdate(
            req.userData._id,
            { $push: { menuItems: item } }
        );

        return res.status(200).json({successmessage: "Item added successfully"});
    }
    else {
        item = {
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            description: req.body.description,
        };
        // await Restaurant.findOneAndUpdate({_id: user._id}, {logo: logo});

        await Restaurant.findByIdAndUpdate(
            req.userData._id,
            { $push: { menuItems: item } }
        );

        return res.status(200).json({successmessage: "Item added successfully"});
    }

    // if(req.body.image) {
    //     await Restaurant.findByIdAndUpdate(req.userData._id,{$pull:{ images: req.body.image }});
    //     return res.status(200).json({successmessage: "Image deleted successfully."});
    // }

    return res.status(404).json({errormessage: "Error"});
}

async function handleEditMenuItem(req, res) {
    await uploadAsync(req, res);

    const image = req.files?.image?.[0]?.filename || null;

    const updateData = {
        "menuItems.$.name": req.body.name,
        "menuItems.$.price": req.body.price,
        "menuItems.$.category": req.body.category,
        "menuItems.$.description": req.body.description
    };

    if(image!=null) {
        updateData["menuItems.$.image"] = image;
    }

    const updatedRestaurant = await Restaurant.findOneAndUpdate(
        { 
            _id: req.userData._id, 
            "menuItems._id": req.body._id 
        },
        { $set: updateData }
    );

    if (!updatedRestaurant) {
        return res.status(404).json({ errormessage: "Restaurant or Menu Item not found" });
    }

    return res.status(200).json({ successmessage: "Item updated successfully" });
}

async function handleDeleteMenuItem(req, res) {
    await uploadAsync(req, res);

    const result = await Restaurant.updateOne(
        { _id: req.userData._id },
        { $pull: { menuItems: { _id: req.body._id } } }
    );

    if(result) return res.status(200).json({ successmessage: "Item deleted successfully" });
    else return res.status(409).json({ errormessage: "Error" });
}

module.exports = {
    handleEditProfile,
    
    handleUploadImage,
    handleSetAsDp,
    handleDeleteImage,

    handleAddMenuItem,
    handleEditMenuItem,
    handleDeleteMenuItem,
    handleSettings,
};