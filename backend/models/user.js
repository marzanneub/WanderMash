const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
        email: {
            type: String,
            required: true,
            unique: true,
        },
        profilePicture: {
            type: String,
            default: "adminDefault.png",
        },
        role: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        verified: {
            type: Boolean,
            default: false,
        }
    }
);
const Admin = mongoose.model("admin", adminSchema);

const generalUserSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        bio: {
            type: String,
            default: "",
        },
        profilePicture: {
            type: String,
            default: "generalUserDefault.jpg",
        },
        role: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        Privacy: {
            type: Boolean,
            default: false,
        },
        verified: {
            type: Boolean,
            required: true,
            default: false,
        },
        approved: {
            type: Boolean,
            required: true,
            default: true,
        },
    }, {timestamps: true}
);
const GeneralUser = mongoose.model("generalUser", generalUserSchema);

const attractionSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: "",
        },
        district: {
            type: String,
            required: true,
        },
        upazila: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            default: "",
            required: true,
        },
        location: {
            latitude: { type: Number },
            longitude: { type: Number }
        },
        socialLinks: {
            facebook: {type: String,  default: ""},
            instagram: {type: String,  default: ""},
            twitter: {type: String,  default: ""},
        },
        images: [{
            type: String,
        }],
        dp: {
            type: String,
            default: "attractionDefault.jpg",
        },
        views: [String],
        facilities: [String],
        openingHours: {
            saturday: { open: {type: String,  default: ""}, close: {type: String,  default: ""} },
            sunday: { open: {type: String,  default: ""}, close: {type: String,  default: ""} },
            monday: { open: {type: String,  default: ""}, close: {type: String,  default: ""} },
            tuesday: { open: {type: String,  default: ""}, close: {type: String,  default: ""} },
            wednesday: { open: {type: String,  default: ""}, close: {type: String,  default: ""} },
            thursday: { open: {type: String,  default: ""}, close: {type: String,  default: ""} },
            friday: { open: {type: String,  default: ""}, close: {type: String,  default: ""} },
        },
        clicks: {
            type: Number,
            default: 0,
        },
        videoUrl: {
            type: String,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "tourismManager",
            required: true
        },
        reviews: [
            {
              userId: { type: mongoose.Schema.Types.ObjectId, ref: "generalUser" },
              name: String,
              rating: { type: Number, min: 1, max: 5 },
              comment: String,
              createdAt: { type: Date, default: Date.now() },
            },
        ],
        averageRating: {
            type: Number,
            default: 0,
        },
        approved: {
            type: Boolean,
            default: true,
        },
    }, {timestamps: true}
);
const Attraction = mongoose.model("attraction", attractionSchema);

const restaurantSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        logo: {
            type: String,
            default: "restaurantDefault.jpg",
        },
        registrationId: {
            type: String,
            required: true,
            unique: true,
        },
        address: {
            type: String,
            required: true,
        },
        location: {
            latitude: { type: Number },
            longitude: { type: Number },
        },
        description: {
            type: String,
            default: "",
        },
        role: {
            type: String,
            required: true,
        },
        district: {
            type: String,
            required: true,
        },
        upazila: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            default: "",
        },
        socialLinks: {
            facebook: {type: String,  default: ""},
            instagram: {type: String,  default: ""},
            twitter: {type: String,  default: ""},
        },
        menuItems: [
            {
                name: { type: String, required: true },
                category: String,
                price: { type: Number, required: true },
                description: String,
                image: { type: String, default: "restaurantDefault.jpg" },
                isAvailable: { type: Boolean, default: true },
            },
        ],
        cuisines: [String],
        facilities: [String],
        openingHours: {
            saturday: { open: {type: String,  default: ""}, close: {type: String,  default: ""} },
            sunday: { open: {type: String,  default: ""}, close: {type: String,  default: ""} },
            monday: { open: {type: String,  default: ""}, close: {type: String,  default: ""} },
            tuesday: { open: {type: String,  default: ""}, close: {type: String,  default: ""} },
            wednesday: { open: {type: String,  default: ""}, close: {type: String,  default: ""} },
            thursday: { open: {type: String,  default: ""}, close: {type: String,  default: ""} },
            friday: { open: {type: String,  default: ""}, close: {type: String,  default: ""} },
        },
        images: [{
            type: String,
        }],
        dp: {
            type: String,
            default: "restaurantDefault.jpg",
        },
        clicks: {
            type: Number,
            default: 0,
        },
        videoUrl: {
            type: String,
        },
        reviews: [
            {
              userId: { type: mongoose.Schema.Types.ObjectId, ref: "generalUser" },
              name: String,
              rating: { type: Number, min: 1, max: 5 },
              comment: String,
              createdAt: { type: Date, default: Date.now() },
            },
        ],
        averageRating: {
            type: Number,
            default: 0,
        },
        password: {
            type: String,
            required: true,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        approved: {
            type: Boolean,
            default: true,
        },
    }, {timestamps: true}
);
const Restaurant = mongoose.model("restaurant", restaurantSchema);

const tourismManagerSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            default: 'tourismManager'
        },
        district: {
            type: String,
            required: true
        },
        address: {
            type: String,
            default: ""
        },
        profilePicture: {
            type: String,
            default: "tourismManagerDefault.jpg",
        },
        verified: {
            type: Boolean,
            default: true,
        },
        approved: {
            type: Boolean,
            default: true,
        },
    }, {timestamps: true}
);
const TourismManager = mongoose.model("tourismManager", tourismManagerSchema);

module.exports = {
    Admin,
    GeneralUser,
    Attraction,
    Restaurant,
    TourismManager,
};