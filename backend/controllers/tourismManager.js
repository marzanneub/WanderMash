const nodemailer = require("nodemailer");
const multer = require("multer");
const util = require("util");
const bcrypt = require ("bcrypt");

const { TourismManager } = require("../models/user");
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


module.exports = {
    handleSettings,
};