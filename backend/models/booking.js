const mongoose = require("mongoose");

const hotelBookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "generalUser", required: true },
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "hotel", required: true },

    roomTitle: { type: String, required: true },
    bedConfig: {
        singleBeds: { type: Number, default: 1 },
        doubleBeds: { type: Number, default: 0 },
        extraBedsAvailable: { type: Boolean, default: false }
    },
    roomSize: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    roomNumber: { type: Number, required: true },
    furnishings: [String],
    amenities: [String],

    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    totalAmount: { type: Number, required: true },
    
    status: {
        type: String,
        default: "pending",
    },
}, { timestamps: true });

const HotelBooking = mongoose.model("hotelBooking", hotelBookingSchema);

module.exports = {
    HotelBooking,
};