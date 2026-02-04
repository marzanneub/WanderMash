const nodemailer = require("nodemailer");
const bcrypt = require ("bcrypt");
const {setUser, getUser} = require("../services/auth");
const { Admin, Attraction, GeneralUser, Hotel, Restaurant, TourismManager } = require("../models/user");
const { Verification } = require("../models/verification");

/////////////////////////Need to handle many types of user in this fucntion///////////////////////////////
async function handleUserRegistration(req, res) {
    let {role, name, email, phone, registrationId, district, area, address, password} = req.body;

    if(phone.startsWith("880")) {
        phone = `+${phone}`;
    } else if(phone.startsWith("0")) {
        phone = `+880${phone.slice(1)}`;
    } else if(!phone.startsWith("+880")) {
        phone = `+880${phone}`;
    }

    let user = await Admin.find({ email: email });
    if(!user.length) user = await Attraction.find({ email: email });
    if(!user.length) user = await GeneralUser.find({ email: email });
    if(!user.length) user = await Hotel.find({ email: email });
    if(!user.length) user = await Restaurant.find({ email: email });
    if(!user.length) user = await TourismManager.find({ email: email });
    if(user.length) return res.status(409).json({errormessage: "Email already exists"});

    user = await Admin.find({ phone: phone });
    if(!user.length) user = await Attraction.find({ phone: phone });
    if(!user.length) user = await GeneralUser.find({ phone: phone });
    if(!user.length) user = await Hotel.find({ phone: phone });
    if(!user.length) user = await Restaurant.find({ phone: phone });
    if(!user.length) user = await TourismManager.find({ phone: phone });
    if(user.length) return res.status(409).json({errormessage: "Phone number already exists"});

    const hash = bcrypt.hashSync(password, 10);

    if(role === "generalUser")
    {
        await GeneralUser.create({
            name,
            email,
            phone,
            role,
            password: hash,
        });
    }
    else if(role === "restaurant")
    {
        user = await Restaurant.find({ registrationId: registrationId });
        if(user.length) return res.status(409).json({errormessage: "Registration ID already exists"});

        await Restaurant.create({
            role,
            name,
            email,
            phone,
            registrationId,
            district,
            area,
            address,
            password: hash,
        });
    }
    else if(role === "hotel")
    {
        user = await Hotel.find({ registrationId: registrationId });
        if(user.length) return res.status(409).json({errormessage: "Registration ID already exists"});

        await Hotel.create({
            role,
            name,
            email,
            phone,
            registrationId,
            district,
            area,
            address,
            password: hash,
        });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await Verification.findOneAndDelete({ email: email });
    await Verification.create({
        email,
        code,
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
            subject: "Let’s Get Started! Here’s Your WanderMash Verification Code",
            text: `Welcome, Sir!\nWe're delighted to have you here at WanderMash.\nExplore, plan, and enjoy your journey with us — your perfect travel experience starts now.\n\nTo get started, please verify your email using the code below:\n\nYour verification code is: ${code}`,
        });

        console.log("Message sent:", info.messageId);
    }

    res.cookie("email", email);
    return res.status(200).json({successmessage: "Registration Successful"});
}

/////////////////////////Need to handle many types of user in this fucntion///////////////////////////////
async function handleUserVerification(req, res) {
    let email;
    if (req.cookies && req.cookies.email) {
        email = req.cookies.email;
    } else {
        return;
    }

    let {code} = req.body;

    let result = await Verification.find({ email: email, code: code });
    if(!result.length)
    {
        return res.status(401).json({errormessage: "Invalid verification code"});
    }

    await Verification.findOneAndDelete({ email: email, code: code });

    await Admin.findOneAndUpdate({ email: email }, { verified: true });
    await GeneralUser.findOneAndUpdate({ email: email }, { verified: true });
    await Hotel.findOneAndUpdate({ email: email }, { verified: true });
    await Restaurant.findOneAndUpdate({ email: email }, { verified: true });
    await TourismManager.findOneAndUpdate({ email: email }, { verified: true });

    return res.status(200).json({successmessage: "Verification successful"});
}

/////////////////////////Need to handle many types of user in this fucntion///////////////////////////////
async function handleUserResendVerificationCode(req, res) {
    let email;
    if (req.body && req.body.email) {
        email = req.body.email;
    } else if (req.cookies && req.cookies.email) {
        email = req.cookies.email;
    } else {
        return;
    }
    
    let user = await Admin.findOne({email});
    if(!user) user = await GeneralUser.findOne({email});
    if(!user) user = await Hotel.findOne({email});
    if(!user) user = await Restaurant.findOne({email});
    if(!user) user = await TourismManager.findOne({email});

    if(user){
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        await Verification.findOneAndDelete({email: email});
        await Verification.create({
            email,
            code,
        });

        if(process.env.MAIL_SENDING==="true") {
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
                subject: "Reset Your WanderMash Password",
                text: `Hi there!\nWe received a request to reset your password for your WanderMash account.\nYour reset password code is: ${code}`,
            });

            console.log("Message sent:", info.messageId);
        }

        res.cookie("email", email);
        return res.status(200).json({successmessage: "A new verification code has been sent to your email address. Please check your inbox to proceed."});
    }

    return res.status(401).json({errormessage: "Invalid email"});
}

/////////////////////////Need to handle many types of user in this fucntion///////////////////////////////
async function handleForgotPassword(req, res) {
    let email;
    if (req.body && req.body.email) {
        email = req.body.email;
    } else if (req.cookies && req.cookies.email) {
        email = req.cookies.email;
    } else {
        return;
    }
    
    let user = await Admin.findOne({email});
    if(!user) user = await GeneralUser.findOne({email});
    if(!user) user = await Hotel.findOne({email});
    if(!user) user = await Restaurant.findOne({email});
    if(!user) user = await TourismManager.findOne({email});

    if(user){
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        await Verification.findOneAndDelete({email: email});
        await Verification.create({
            email,
            code,
        });

        if(process.env.MAIL_SENDING==="true") {
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
                subject: "Reset Your WanderMash Password",
                text: `Hi there!\nWe received a request to reset your password for your WanderMash account.\nYour reset password code is: ${code}`,
            });

            console.log("Message sent:", info.messageId);
        }

        res.cookie("email", email);
        return res.status(200).json({successmessage: "A new password reset code has been sent to your email address. Please check your inbox to proceed."});
    }

    return res.status(401).json({errormessage: "Invalid email"});
}

/////////////////////////Need to handle many types of user in this fucntion///////////////////////////////
async function handleResetPassword(req, res){
    let email;
    if (req.cookies && req.cookies.email) {
        email = req.cookies.email;
    } else {
        return;
    }
    const {code, password, confirmPassword} = req.body;

    let result = await Verification.find({ email: email, code: code });
    if(!result.length)
    {
        return res.status(401).json({errormessage: "Invalid verification code"});
    }

    await Verification.findOneAndDelete({ email: email, code: code });

    const hash = bcrypt.hashSync(password, 10);
    await Admin.findOneAndUpdate({email}, {password: hash});
    await GeneralUser.findOneAndUpdate({email}, {password: hash});
    await Hotel.findOneAndUpdate({email}, {password: hash});
    await Restaurant.findOneAndUpdate({email}, {password: hash});
    await TourismManager.findOneAndUpdate({email}, {password: hash});

    return res.status(200).json({successmessage: "Password reset successful"});
}

/////////////////////////Need to handle many types of user in this fucntion///////////////////////////////
async function handleUserLogin(req, res) {
    const {email, password} = req.body;
    let user = await Admin.findOne({email});
    if(!user)  user = await GeneralUser.findOne({email});
    if(!user)  user = await Hotel.findOne({email});
    if(!user)  user = await Restaurant.findOne({email});
    if(!user)  user = await TourismManager.findOne({email});
    if(!user)  return res.status(401).json({errormessage: "Invalid email or Password"});

    if(bcrypt.compareSync(password, user.password)==false) return res.status(401).json({errormessage: "Invalid email or Password"});

    if(user.verified === false) {
        res.cookie("email", email);
        return res.status(401).json({errormessage: "Not verified"});
    }

    if(user.approved === false) {
        return res.status(401).json({errormessage: "Your account is disapproved"});
    }

    const token = setUser(user);
    res.cookie("user", token);
    return res.status(200).json({successmessage: "Login Successful"});
}


module.exports = {
    handleUserRegistration,
    handleUserVerification,
    handleUserResendVerificationCode,
    handleForgotPassword,
    handleResetPassword,
    handleUserLogin,
};