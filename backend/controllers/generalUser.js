const multer = require("multer");
const util = require("util");
const bcrypt = require ("bcrypt");
const { Admin, Attraction, GeneralUser, Hotel, Restaurant, TourismManager } = require("../models/user");
const { HotelBooking } = require("../models/booking");
const { BKashAccount } = require("../models/paymentAccount");

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
    if(!result) result =  await Attraction.findOne({ phone: phone });
    if(!result) result =  await Hotel.findOne({ phone: phone });
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

async function handleBkashPayment(req, res) {
    const { hotelID, selectedRoomType, checkIn, checkOut, accountNumber, pinNumber, totalAmount } = req.body;

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const datesToBlock = [];

    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        datesToBlock.push(new Date(d));
    }

    try{
        const hotel = await Hotel.findById(hotelID);
        if(!hotel) return res.status(404).json({errormessage: "Hotel not found"});
        
        const roomType = hotel.roomTypes.id(selectedRoomType);
        if(!roomType) return res.status(404).json({errormessage: "Room type not found"});

        const availableRoom = roomType.rooms.find(room => {
            return !room.unavailableDates.some(unavailableDate => 
                datesToBlock.some(blockDate => blockDate.getTime() === unavailableDate.getTime())
            );
        });

        if (!availableRoom) {
            return res.status(404).json({errormessage: "Sorry this room is booked most recently, you are too late"});
        }

        const account = await BKashAccount.findOne({ accountNumber: accountNumber, pinNumber: pinNumber});
        if(account) {
            if(account.balance <= totalAmount) return res.status(404).json({errormessage: "Insufficient balance"});

            const result = await BKashAccount.findOneAndUpdate({ accountNumber: accountNumber }, {balance: account.balance-totalAmount});

            if(result) return res.status(200).json({successmessage: "found"});
            else return res.status(404).json({errormessage: "Error"});
        }
        else {
            return res.status(404).json({errormessage: "Invalid information"});
        }
    }
    catch(error) {
        return res.status(404).json({errormessage: error});
    }
}
async function handleBookHotel(req, res) {
    const { hotelID, selectedRoomType, totalAmount, checkIn, checkOut, accountNumber } = req.body;

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const datesToBlock = [];

    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        datesToBlock.push(new Date(d));
    }

    try{
        const hotel = await Hotel.findById(hotelID);
        if(!hotel) return res.status(404).json({errormessage: "Hotel not found"});
        
        const roomType = hotel.roomTypes.id(selectedRoomType);
        if(!roomType) return res.status(404).json({errormessage: "Room type not found"});

        const availableRoom = roomType.rooms.find(room => {
            return !room.unavailableDates.some(unavailableDate => 
                datesToBlock.some(blockDate => blockDate.getTime() === unavailableDate.getTime())
            );
        });

        if (!availableRoom) {
            return res.status(404).json({errormessage: "No rooms available during these dates"});
        }
        
        availableRoom.unavailableDates.push(...datesToBlock);
        
        await hotel.save();

        const newBooking = new HotelBooking({
            userId: req.userData._id,
            hotelId: hotelID,

            roomTitle: roomType.title,
            bedConfig: roomType.bedConfig,
            capacity: roomType.capacity,
            roomSize: roomType.roomSize,
            pricePerNight: roomType.pricePerNight,
            roomNumber: availableRoom.roomNumber,
            furnishings: roomType.furnishings,
            amenities: roomType.amenities,

            checkInDate: start,
            checkOutDate: end,
            totalAmount: totalAmount,
            accountNumber: accountNumber,
            status: "confirmed"

        });

        await newBooking.save();

        return res.status(200).json({successmessage: `Booking successful, your room number is ${availableRoom.roomNumber}`});

    }
    catch(error) {
        return res.status(404).json({errormessage: error});
    }
}

async function handleCancelHotelBooking(req, res) {
    const { bookingId, accountNumber } = req.body;
    // console.log(bookingId)
    
    try{
        let booking = await HotelBooking.findOne({_id: bookingId, userId: req.userData._id});
        if(!booking) return res.status(404).json({errormessage: "Not found"});

        let hotel = await Hotel.findById(booking.hotelId);
        if(!hotel) return res.status(404).json({errormessage: "Not found"});
        if(hotel.policies.cancellation === "Fixed") return res.status(409).json({errormessage: "No cancellation acceptable for this hotel"});

        booking.status = "cancelled";
        await booking.save();

        let account = await BKashAccount.findOne({ accountNumber: booking.accountNumber});
        account.balance+=booking.totalAmount;
        await account.save();

        const start = new Date(booking.checkInDate);
        const end = new Date(booking.checkOutDate);
        const datesToRemove = [];

        for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
            datesToRemove.push(new Date(d).getTime()); // Store as timestamp for easy comparison
        }
        
        let roomFound = null;
        hotel.roomTypes.forEach(type => {
            const room = type.rooms.find(r => r.roomNumber === booking.roomNumber);
            if (room) roomFound = room;
        });

        if (roomFound) {
            roomFound.unavailableDates = roomFound.unavailableDates.filter(date => {
                return !datesToRemove.includes(new Date(date).getTime());
            });
            
            hotel.markModified('roomTypes'); 
            await hotel.save();
        }

        return res.status(200).json({successmessage: "Booking is cancelled successfully"});
    }
    catch(error) {
        return res.status(404).json({errormessage: error});
    }
}

module.exports = {
    handleEditProfile,
    handleSettings,

    handleBkashPayment,
    handleBookHotel,
    handleCancelHotelBooking,
};