const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema({
        email: {
            type: String,
            required: true,
            unique: true,
        },
        code: {
            type: String,
            required: true,
        }
    }
);
const Verification = mongoose.model("verificationCode", verificationSchema);

module.exports = {
    Verification,
};