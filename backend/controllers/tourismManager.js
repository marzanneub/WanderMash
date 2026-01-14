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
]);
const uploadAsync = util.promisify(upload);

/////////////////////////Need to handle many types of user in this fucntion///////////////////////////////
async function handleEditProfile(req, res) {
    await uploadAsync(req, res);
    const {name, phone, district, address} = req.body;

    const profilePicture = req.files?.profilePicture?.[0]?.filename || null;

    let result =  await TourismManager.findOne({ _id: { $ne: req.userData._id },  phone: phone });
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

async function handleAddAttraction(req, res) {
    await uploadAsync(req, res);
    
    const result = await Attraction.create({
        name: req.body.name,
        category: req.body.category,
        district: req.body.district,
        upazila: req.body.upazila,
        address: req.body.address,
        createdBy: req.userData._id,
    });

    if(result) return res.status(200).json({ successmessage: "Attraction added successfully" });
    else return res.status(409).json({ errormessage: "Error" });
}


module.exports = {
    handleEditProfile,
    handleSettings,
    handleAddAttraction,
};