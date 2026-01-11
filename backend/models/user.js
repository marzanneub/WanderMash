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
            default: false,
        }
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
        },
        location: {
            latitude: { type: Number },
            longitude: { type: Number }
        },
        socialLinks: {
            facebook: String,
            instagram: String,
            twitter: String,
        },
        images: [{
            type: String,
        }],
        dp: {
            type: String,
            default: "default.jpg",
        },
        views: {
            natural: {
                river: { type: Boolean, default: false },
                hill: { type: Boolean, default: false },
                stone: { type: Boolean, default: false },
                waterfall: { type: Boolean, default: false },
                lake: { type: Boolean, default: false },
                forest: { type: Boolean, default: false },
                mangrove: { type: Boolean, default: false },
                beach: { type: Boolean, default: false },
                ocean: { type: Boolean, default: false },
                island: { type: Boolean, default: false },
                valley: { type: Boolean, default: false },
                sunrise: { type: Boolean, default: false },
                sunset: { type: Boolean, default: false },
                wetland: { type: Boolean, default: false },
                cave: { type: Boolean, default: false },
                riverbank: { type: Boolean, default: false },
                villageView: { type: Boolean, default: false },
            },
            cultural: {
                ruralCountryside: { type: Boolean, default: false },
                festivalVenue: { type: Boolean, default: false },
                architectural: { type: Boolean, default: false },
                museumView: { type: Boolean, default: false },
                heritageSite: { type: Boolean, default: false },
                urbanSkyline: { type: Boolean, default: false },
            },
            historical: {
                archaeologicalSite: { type: Boolean, default: false },
                monument: { type: Boolean, default: false },
                heritageSite: { type: Boolean, default: false },
                templeView: { type: Boolean, default: false },
                urbanSkyline: { type: Boolean, default: false },
            },
            religious: {
                templeView: { type: Boolean, default: false },
                mosqueView: { type: Boolean, default: false },
                pagodaView: { type: Boolean, default: false },
                quietZones: { type: Boolean, default: false },
            },
            adventure: {
                hill: { type: Boolean, default: false },
                valley: { type: Boolean, default: false },
                cave: { type: Boolean, default: false },
                river: { type: Boolean, default: false },
            },
            urban: {
                urbanSkyline: { type: Boolean, default: false },
                cityPark: { type: Boolean, default: false },
                marketView: { type: Boolean, default: false },
                waterfront: { type: Boolean, default: false },
            },
        },
        facilities: {
            natural: {
                parking: { type: Boolean, default: false },
                restrooms: { type: Boolean, default: false },
                drinkingWater: { type: Boolean, default: false },
                foodStalls: { type: Boolean, default: false },
                guideService: { type: Boolean, default: false },
                hikingTrails: { type: Boolean, default: false },
                picnicArea: { type: Boolean, default: false },
                swimmingArea: { type: Boolean, default: false },
                boatingAllowed: { type: Boolean, default: false },
                campingAllowed: { type: Boolean, default: false },
                kidsPlayArea: { type: Boolean, default: false },
                wheelchairAccessible: { type: Boolean, default: false },
                lockerFacility: { type: Boolean, default: false },
                photographyAllowed: { type: Boolean, default: false },
                nightStay: { type: Boolean, default: false },
                souvenirShops: { type: Boolean, default: false },
            },
            cultural: {
                parking: { type: Boolean, default: false },
                restrooms: { type: Boolean, default: false },
                drinkingWater: { type: Boolean, default: false },
                foodStalls: { type: Boolean, default: false },
                guideService: { type: Boolean, default: false },
                souvenirShops: { type: Boolean, default: false },
                wheelchairAccessible: { type: Boolean, default: false },
                photographyAllowed: { type: Boolean, default: false },
                lockerFacility: { type: Boolean, default: false },
                audioGuidesAvailable: { type: Boolean, default: false },
                educationalPrograms: { type: Boolean, default: false },
                cafeOrRestaurant: { type: Boolean, default: false },
                nightToursAvailable: { type: Boolean, default: false },
            },
            historical: {
                parking: { type: Boolean, default: false },
                restrooms: { type: Boolean, default: false },
                guideService: { type: Boolean, default: false },
                souvenirShops: { type: Boolean, default: false },
                wheelchairAccessible: { type: Boolean, default: false },
                photographyAllowed: { type: Boolean, default: false },
                audioGuidesAvailable: { type: Boolean, default: false },
                educationalPrograms: { type: Boolean, default: false },
                cafeOrRestaurant: { type: Boolean, default: false },
                lockerFacility: { type: Boolean, default: false },
                nightToursAvailable: { type: Boolean, default: false },
            },
            religious: {
                parking: { type: Boolean, default: false },
                restrooms: { type: Boolean, default: false },
                guideService: { type: Boolean, default: false },
                donationBoxes: { type: Boolean, default: false },
                souvenirShops: { type: Boolean, default: false },
                wheelchairAccessible: { type: Boolean, default: false },
                photographyAllowed: { type: Boolean, default: false },
                prayerRooms: { type: Boolean, default: false },
                foodStalls: { type: Boolean, default: false },
                quietZones: { type: Boolean, default: false },
            },
            adventure: {
                parking: { type: Boolean, default: false },
                guideService: { type: Boolean, default: false },
                hikingTrails: { type: Boolean, default: false },
                campingAllowed: { type: Boolean, default: false },
                equipmentRental: { type: Boolean, default: false },
                firstAidStation: { type: Boolean, default: false },
                restrooms: { type: Boolean, default: false },
                drinkingWater: { type: Boolean, default: false },
                lockerFacility: { type: Boolean, default: false },
                nightStay: { type: Boolean, default: false },
                photographyAllowed: { type: Boolean, default: false },
            },
            urban: {
                parking: { type: Boolean, default: false },
                restrooms: { type: Boolean, default: false },
                guideService: { type: Boolean, default: false },
                foodStalls: { type: Boolean, default: false },
                souvenirShops: { type: Boolean, default: false },
                wheelchairAccessible: { type: Boolean, default: false },
                photographyAllowed: { type: Boolean, default: false },
                publicTransportAccess: { type: Boolean, default: false },
                cafeOrRestaurant: { type: Boolean, default: false },
                lockerFacility: { type: Boolean, default: false },
            }
        },
        openingHours: {
            saturday: { open: String, close: String },
            sunday: { open: String, close: String },
            monday: { open: String, close: String },
            tuesday: { open: String, close: String },
            wednesday: { open: String, close: String },
            thursday: { open: String, close: String },
            friday: { open: String, close: String },
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