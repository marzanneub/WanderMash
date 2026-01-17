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

module.exports = {
    handleEditProfile,

    handleSettings,
};