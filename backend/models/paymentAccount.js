const mongoose = require("mongoose");

const bKashAccountSchema = new mongoose.Schema({
        accountNumber: {
            type: String,
            required: true,
            unique: true,
        },
        pinNumber: {
            type: String,
            required: true,
        },
        balance: {
            type: Number,
            required: true,
            default: 0,
        },
        accountType: {
            type: String,
            default: 'Personal'
        },
        isActive: {
            type: Boolean,
            default: true
        }
    }, {timestamps: true}
);
const BKashAccount = mongoose.model('bKashAccount', bKashAccountSchema);

module.exports = {
    BKashAccount,
};