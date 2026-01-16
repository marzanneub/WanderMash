const nodemailer = require("nodemailer");
const multer = require("multer");
const util = require("util");
const bcrypt = require ("bcrypt");

const { Attraction, GeneralUser, Restaurant, Admin, TourismManager } = require("../models/user");
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

    const user = await Admin.findOne({ _id: req.userData._id});
    
    if(password.length) {
        if(bcrypt.compareSync(password, user.password)==false) return res.status(401).json({errormessage: "Current password is invalid"});
        const hash = bcrypt.hashSync(newPassword, 10);
        await Admin.findOneAndUpdate({_id: user._id}, {password: hash});
    }
    
    return res.status(201).json({successmessage: "Successfully settings updated"});
}

/////////////////////////Need to handle many types of user in this fucntion///////////////////////////////
async function handleAddTourismManager(req, res) {
    await uploadAsync(req, res);
    let { name, email, phone, district } = req.body;

    if(phone.startsWith("880")) {
        phone = `+${phone}`;
    } else if(phone.startsWith("0")) {
        phone = `+880${phone.slice(1)}`;
    } else if(!phone.startsWith("+880")) {
        phone = `+880${phone}`;
    }

    let result = await Admin.find({ email: email });
    if (result.length == 0) result = await Attraction.find({ email: email });
    if (result.length == 0) result = await GeneralUser.find({ email: email });
    if (result.length == 0) result = await Restaurant.find({ email: email });
    if (result.length == 0) result = await TourismManager.find({ email: email });
    if (result.length) return res.status(409).json({errormessage: "Email already exists"});
    
    if (result.length == 0) result = await Admin.find({ phone: phone });
    if (result.length == 0) result = await Attraction.find({ phone: phone });
    if (result.length == 0) result = await GeneralUser.find({ phone: phone });
    if (result.length == 0) result = await Restaurant.find({ phone: phone });
    if (result.length == 0) result = await TourismManager.find({ phone: phone });
    if (result.length) return res.status(409).json({errormessage: "Phone number already exists"});

    const password = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const hash = bcrypt.hashSync(password, 10);

    await TourismManager.create({
        name: name,
        email: email,
        phone: phone,
        district: district,
        password: hash,
    });

    if(process.env.MAIL_SENDING==="true"){
        const transporter = await nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: Number(process.env.MAILTRAP_PORT),
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS,
            },
        });
    
        const info = await transporter.sendMail({
            from: '<wandermash.travel@gmail.com>',
            to: email,
            subject: "Let’s Get Started! Here’s Your WanderMash Email And Password",
            text: `Welcome, Sir!\nWe're delighted to have you here at WanderMash as a Tourism Manager.\nTo get started, here is your email address and temporary password below:\n\nYour email is ${email} and password is: ${password}`,
        });
    
        console.log("Message sent:", info.messageId);
    }

    return res.status(200).json({successmessage: "Tourism Manager is added successfully."});

}


async function handleDisapproveTourismManager(req, res) {
    await uploadAsync(req, res);
    const { _id } = req.body;

    const result = await TourismManager.findByIdAndUpdate(_id, { approved: false });

    if(result) return res.status(200).json({successmessage: "Tourism Manager disapproved successfully."});
    else return res.status(409).json({errormessage: "Error"});
}

async function handleApproveTourismManager(req, res) {
    await uploadAsync(req, res);
    const { _id } = req.body;

    const result = await TourismManager.findByIdAndUpdate(_id, { approved: true });

    if(result) return res.status(200).json({successmessage: "Tourism Manager approved successfully."});
    else return res.status(409).json({errormessage: "Error"});
}


module.exports = {
    handleSettings,
    handleAddTourismManager,
    handleDisapproveTourismManager,
    handleApproveTourismManager,
};