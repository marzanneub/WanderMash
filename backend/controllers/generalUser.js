const multer = require("multer");
const util = require("util");
const bcrypt = require ("bcrypt");
const { Admin, GeneralUser, Restaurant, TourismManager } = require("../models/user");

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
    const {name, phone, bio} = req.body;

    const profilePicture = req.files?.profilePicture?.[0]?.filename || null;

    let result =  await GeneralUser.findOne({ _id: { $ne: req.userData._id },  phone: phone });
    if(!result) result =  await Restaurant.findOne({ phone: phone });
    if(!result) result =  await TourismManager.findOne({ phone: phone });
    if(result) return res.status(409).json({errormessage: "Phone number already exists"});

    if(profilePicture!=null) await GeneralUser.findOneAndUpdate({_id: req.userData._id}, {profilePicture: profilePicture});
    result = await GeneralUser.findOneAndUpdate({_id: req.userData._id}, {name: name, phone: phone, bio: bio});

    return res.status(200).json({successmessage: "Successfully Updated"});

}

async function handleSettings(req, res) {
    const { password, newPassword, confirmPassword } = req.body;
    
    const user = await GeneralUser.findOne({ _id: req.userData._id});

    if(password.length) {
        if(bcrypt.compareSync(password, user.password)==false) return res.status(401).json({errormessage: "Current password is invalid"});
        const hash = bcrypt.hashSync(newPassword, 10);
        await GeneralUser.findOneAndUpdate({_id: user._id}, {password: hash});
    }

    return res.status(201).json({successmessage: "Successfully settings updated"});
}

module.exports = {
    handleEditProfile,
    handleSettings,
};