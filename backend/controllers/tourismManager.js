const nodemailer = require("nodemailer");
const multer = require("multer");
const util = require("util");
const bcrypt = require ("bcrypt");

const { Admin, Attraction, GeneralUser, Restaurant, TourismManager } = require("../models/user");
const { Verification } = require("../models/verification");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        return cb(null, "./public/images");
    },
    filename: function(req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage }).fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "image", maxCount: 1 },
]);
const uploadAsync = util.promisify(upload);

/////////////////////////Need to handle many types of user in this fucntion///////////////////////////////
async function handleEditProfile(req, res) {
    await uploadAsync(req, res);
    const {name, phone, district, address} = req.body;

    const profilePicture = req.files?.profilePicture?.[0]?.filename || null;

    let result =  await TourismManager.findOne({ _id: { $ne: req.userData._id },  phone: phone });
    if(!result) result =  await Attraction.findOne({ phone: phone });
    if(!result) result =  await Restaurant.findOne({ phone: phone });
    if(!result) result =  await GeneralUser.findOne({ phone: phone });
    if(result) return res.status(409).json({errormessage: "Phone number already exists"});

    if(profilePicture!=null) await TourismManager.findOneAndUpdate({_id: req.userData._id}, {profilePicture: profilePicture});
    result = await TourismManager.findOneAndUpdate({_id: req.userData._id}, {name: name, phone: phone, district: district, address: address});

    return res.status(200).json({successmessage: "Successfully Updated"});

}

async function handleSettings(req, res) {
    await uploadAsync(req, res);
    const { password, newPassword, confirmPassword } = req.body;

    const user = await TourismManager.findOne({ _id: req.userData._id});
    
    if(password.length) {
        if(bcrypt.compareSync(password, user.password)==false) return res.status(401).json({errormessage: "Current password is invalid"});
        const hash = bcrypt.hashSync(newPassword, 10);
        await TourismManager.findOneAndUpdate({_id: user._id}, {password: hash});
    }
    
    return res.status(201).json({successmessage: "Successfully settings updated"});
}

/////////////////////////Need to handle many types of user in this fucntion///////////////////////////////
async function handleAddAttraction(req, res) {
    await uploadAsync(req, res);

    let {name, email, phone, category, district, upazila, address} = req.body;

    if(phone.startsWith("880")) {
        phone = `+${phone}`;
    } else if(phone.startsWith("0")) {
        phone = `+880${phone.slice(1)}`;
    } else if(!phone.startsWith("+880")) {
        phone = `+880${phone}`;
    }

    let found =  await Admin.findOne({ email: email });
    if(!found) found =  await GeneralUser.findOne({ email: email });
    if(!found) found =  await Attraction.findOne({ email: email });
    if(!found) found =  await Restaurant.findOne({ email: email });
    if(!found) found =  await TourismManager.findOne({email: email });
    if(found){ return res.status(409).json({errormessage: "Email already exists"}); }

    found =  await GeneralUser.findOne({ phone: phone });
    if(!found) found =  await Attraction.findOne({ phone: phone });
    if(!found) found =  await Restaurant.findOne({ phone: phone });
    if(!found) found =  await TourismManager.findOne({phone: phone });
    if(found){ return res.status(409).json({errormessage: "Phone number already exists"}); }
    
    const result = await Attraction.create({
        name: name,
        phone: phone,
        email: email,
        category: category,
        district: district,
        upazila: upazila,
        address: address,
        createdBy: req.userData._id,
    });

    if(result) return res.status(200).json({ successmessage: "Attraction added successfully" });
    else return res.status(409).json({ errormessage: "Error" });
}

/////////////////////////Need to handle many types of user in this fucntion///////////////////////////////
async function handleEditAttraction(req, res) {
    await uploadAsync(req, res);

    const updates = {...req.body};

    found =  await GeneralUser.findOne({ phone: updates.phone });
    if(!found) found =  await Attraction.findOne({ _id: { $ne: updates.id }, phone: updates.phone });
    if(!found) found =  await Restaurant.findOne({ phone: updates.phone });
    if(!found) found =  await TourismManager.findOne({phone: updates.phone });
    if(found){ return res.status(409).json({errormessage: "Phone number already exists"}); }

    let result =  await Attraction.findOne({ _id: updates.id, createdBy: req.userData._id });
    if(!result){ return res.status(409).json({errormessage: "You cannot edit this attraction because you didn't added this."}); }

    updates.socialLinks = JSON.parse(updates.socialLinks);
    updates.facilities = JSON.parse(updates.facilities);
    updates.views = JSON.parse(updates.views);
    updates.openingHours = JSON.parse(updates.openingHours);
    updates.location = JSON.parse(updates.location);

    // console.log(updates);

    await Attraction.findByIdAndUpdate({_id: updates.id}, { $set: updates });
    return res.status(200).json({successmessage: "Successfully Updated"});
}

async function handleDeleteAttraction(req, res) {
    await uploadAsync(req, res);

    let result =  await Attraction.findOne({ _id: req.body.id, createdBy: req.userData._id });
    if(!result){ return res.status(409).json({errormessage: "You cannot delete this attraction because you didn't added this."}); }

    result = await Attraction.findByIdAndDelete(req.body.id);

    if(result) return res.status(200).json({successmessage: "Successfully Deleted"});
    return res.status(404).json({errormessage: "Error"});

}

async function handleUploadImage(req, res) {
    await uploadAsync(req, res);

    const image = req.files?.image?.[0]?.filename || null;

    let result =  await Attraction.findOne({ _id: req.body.id, createdBy: req.userData._id });
    if(!result){ return res.status(409).json({errormessage: "You cannot edit this attraction because you didn't added this."}); }

    if(image!=null) await Attraction.findByIdAndUpdate(req.body.id,{ $push: { images: image } });

    return res.status(200).json({successmessage: "Successfully Uploaded", imageTitle: image});
}

async function handleSetAsDp(req, res) {
    await uploadAsync(req, res);
    
    let result =  await Attraction.findOne({ _id: req.body.id, createdBy: req.userData._id });
    if(!result){ return res.status(409).json({errormessage: "You cannot edit this attraction because you didn't added this."}); }


    if(req.body.image) {
        await Attraction.findByIdAndUpdate(req.body.id,{ dp: req.body.image });
        return res.status(200).json({successmessage: "Display picture updated successfully."});
    }
    return res.status(404).json({errormessage: "Error"});
}

async function handleDeleteImage(req, res) {
    await uploadAsync(req, res);

    let result =  await Attraction.findOne({ _id: req.body.id, createdBy: req.userData._id });
    if(!result){ return res.status(409).json({errormessage: "You cannot edit this attraction because you didn't added this."}); }

    if(req.body.image) {
        await Attraction.findByIdAndUpdate(req.body.id,{$pull:{ images: req.body.image }});
        return res.status(200).json({successmessage: "Image deleted successfully."});
    }
    return res.status(404).json({errormessage: "Error"});
}


module.exports = {
    handleEditProfile,
    handleSettings,

    handleAddAttraction,
    handleEditAttraction,
    handleDeleteAttraction,

    handleUploadImage,
    handleSetAsDp,
    handleDeleteImage,
};