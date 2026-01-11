"use client";
import React, { useState } from "react";
import { IconType } from "react-icons";
import { 
  FaCreditCard, FaWind, FaLeaf, FaGlassMartiniAlt, FaCoffee, FaApplePay, 
  FaBaby, FaMusic, FaBreadSlice, FaChair, FaUmbrellaBeach, FaBiking, 
  FaBirthdayCake, FaGamepad, FaBook, FaBox, FaUtensils, FaShieldAlt, FaMoneyBillWave, 
  FaTruck, FaHandSparkles, FaSmokingBan, FaTshirt, FaBeer, FaMobileAlt, 
  FaTv, FaParking, FaWifi, FaTree, FaWheelchair, FaSmoking, FaTable, 
  FaUserFriends, FaDoorOpen, FaFirstAid, FaPlug, FaRestroom, FaSwimmingPool, 
  FaMosque, FaCrown, FaCarSide, FaChild, FaUsers, FaUser, FaClock, FaDog, 
  FaWineGlassAlt, FaLock
} from "react-icons/fa";
import { MdOutlineFastfood, MdOutlineEmojiFoodBeverage, MdElevator } from "react-icons/md";
import { GiWheat, GiCheckMark } from "react-icons/gi";

interface ServicesGridProps {
    title: string;
    items: string[];
}

interface FacilityIcon {
  name: string;
  icon: IconType;
}

const restaurantFacilityIconList: FacilityIcon[] = [
    { name: "Accepts Credit Cards", icon: FaCreditCard },
    { name: "Air Conditioned", icon: FaWind },
    { name: "Air Purifier", icon: FaWind },
    { name: "Alcohol Served", icon: FaGlassMartiniAlt },
    { name: "All Day Breakfast", icon: MdOutlineEmojiFoodBeverage },
    { name: "Apple Pay/Google Pay", icon: FaApplePay },
    { name: "Baby High Chairs", icon: FaBaby },
    { name: "Background Music", icon: FaMusic },
    { name: "Bakery Section", icon: FaBreadSlice },
    { name: "Bar Seating", icon: FaChair },
    { name: "Beachfront View", icon: FaUmbrellaBeach },
    { name: "Bike Parking", icon: FaBiking },
    { name: "Birthday Decor Service", icon: FaBirthdayCake },
    { name: "Board Games", icon: FaGamepad },
    { name: "Books/Library", icon: FaBook },
    { name: "Booth Seating", icon: FaBox },
    { name: "Bottomless Brunch", icon: FaGlassMartiniAlt },
    { name: "Buffet Setup", icon: FaUtensils },
    { name: "CCTV Surveillance", icon: FaShieldAlt },
    { name: "Cash Only", icon: FaMoneyBillWave },
    { name: "Casual Dining", icon: FaUtensils },
    { name: "Catering Service", icon: FaTruck },
    { name: "Changing Stations", icon: FaBaby },
    { name: "Clove-Free Environment", icon: FaSmokingBan },
    { name: "Coat Check", icon: FaTshirt },
    { name: "Cocktail Bar", icon: FaGlassMartiniAlt },
    { name: "Coffee Roastery", icon: FaCoffee },
    { name: "Craft Beer Tap", icon: FaBeer },
    { name: "Customized Cakes", icon: FaBirthdayCake },
    { name: "Dairy Free Options", icon: FaLeaf },
    { name: "Dessert Bar", icon: FaBirthdayCake },
    { name: "Diaper Changing Station", icon: FaBaby },
    { name: "Digital Payments (UPI/QR)", icon: FaMobileAlt },
    { name: "Dine-In", icon: FaUtensils },
    { name: "Drive-Thru", icon: FaCarSide },
    { name: "Elderly Friendly", icon: FaUserFriends },
    { name: "Elevator Access", icon: MdElevator },
    { name: "Emergency Exit", icon: FaDoorOpen },
    { name: "EV Charging Station", icon: FaPlug },
    { name: "Farm-to-Table", icon: FaTree },
    { name: "Fast Food", icon: MdOutlineFastfood },
    { name: "Fine Dining", icon: FaUtensils },
    { name: "Fire Extinguisher", icon: FaShieldAlt },
    { name: "First Aid Kit", icon: FaFirstAid },
    { name: "Food Court", icon: FaUtensils },
    { name: "Free Parking", icon: FaParking },
    { name: "Free Wi-Fi", icon: FaWifi },
    { name: "Garden Seating", icon: FaTree },
    { name: "Gender Neutral Bathrooms", icon: FaRestroom },
    { name: "Gift Cards Available", icon: FaCreditCard },
    { name: "Gluten-Free Options", icon: GiWheat },
    { name: "Group Table Arrangements", icon: FaUsers },
    { name: "Halal Certified", icon: GiCheckMark },
    { name: "Hand Sanitizer Stations", icon: FaHandSparkles },
    { name: "Happy Hour", icon: FaGlassMartiniAlt },
    { name: "Heated Seating", icon: FaChair },
    { name: "Home Delivery", icon: FaTruck },
    { name: "Indoor Seating", icon: FaTable },
    { name: "Karaoke", icon: FaMusic },
    { name: "Keto Friendly", icon: FaLeaf },
    { name: "Kid Friendly", icon: FaChild },
    { name: "Kids Menu", icon: FaChild },
    { name: "Late Night Dining", icon: FaClock },
    { name: "Live Kitchen", icon: FaUtensils },
    { name: "Live Music", icon: FaMusic },
    { name: "Live Sports Screening", icon: FaTv },
    { name: "Locker Room", icon: FaLock },
    { name: "Loyalty Program", icon: FaCrown },
    { name: "Mobile Charging Points", icon: FaMobileAlt },
    { name: "Newspapers/Magazines", icon: FaBook },
    { name: "No MSG", icon: FaLeaf },
    { name: "Non-Smoking Area", icon: FaSmokingBan },
    { name: "Open Kitchen", icon: FaUtensils },
    { name: "Organic Ingredients", icon: FaLeaf },
    { name: "Outdoor Seating", icon: FaTree },
    { name: "Pet Friendly", icon: FaDog },
    { name: "Play Area for Children", icon: FaChild },
    { name: "Pool Table", icon: FaGamepad },
    { name: "Poolside Dining", icon: FaSwimmingPool },
    { name: "Prayer Room", icon: FaMosque },
    { name: "Private Dining Rooms", icon: FaDoorOpen },
    { name: "Private Restrooms", icon: FaRestroom },
    { name: "Restrooms", icon: FaRestroom },
    { name: "Rooftop Dining", icon: FaTree },
    { name: "Salad Bar", icon: FaLeaf },
    { name: "Scenic View", icon: FaUmbrellaBeach },
    { name: "Self-Service Counters", icon: FaUser },
    { name: "Shisha/Hookah", icon: FaSmoking },
    { name: "Smoking Area", icon: FaSmoking },
    { name: "Table Reservation", icon: FaTable },
    { name: "Table Service", icon: FaTable },
    { name: "Takeaway", icon: FaBox },
    { name: "Terrace Seating", icon: FaTree },
    { name: "Underground Parking", icon: FaParking },
    { name: "Valet Parking", icon: FaCarSide },
    { name: "Vegan Options", icon: FaLeaf },
    { name: "Vegetarian Friendly", icon: FaLeaf },
    { name: "VIP Membership", icon: FaCrown },
    { name: "Walk-ins Welcome", icon: FaUserFriends },
    { name: "Waiting Lounge", icon: FaChair },
    { name: "Waterfront", icon: FaUmbrellaBeach },
    { name: "Wheelchair Accessible", icon: FaWheelchair },
    { name: "Wine Cellar", icon: FaWineGlassAlt }
];

const ServicesGrid: React.FC<ServicesGridProps> = ({ title, items }) => {
    const [isOpen, setIsOpen] = useState(false);


    const limit = 6;
    const more = items.length > limit;
    const previewItems = items.slice(0, limit);

    return (
        <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-6 border-b-2 border-indigo-300 pb-2 text-indigo-900">
                {title}
            </h3>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                {previewItems.map((item, index) => {
                    const facility = restaurantFacilityIconList.find((f) => f.name === item);
                    const IconComponent = facility?.icon || GiCheckMark;

                    return (
                        <li key={index} className="flex items-center gap-2 text-slate-700">
                            <span className="text-indigo-500 flex-shrink-0">
                                <IconComponent />
                            </span>
                            <span className="text-base font-medium">{item}</span>
                        </li>
                    )
                })}
            </ul>

            {more && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="mt-6 flex items-center gap-2 text-indigo-600 font-bold text-sm hover:text-indigo-800 transition-colors group cursor-pointer"
                >
                    <span>See more</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}

            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-indigo-900">{title}</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors cursor-pointer"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {items.map((item, index) => {
                                    const facility = restaurantFacilityIconList.find((f) => f.name === item);
                                    const IconComponent = facility?.icon || GiCheckMark;

                                    return (
                                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-indigo-50 bg-indigo-50/30 text-slate-700">
                                            <span className="text-indigo-500 flex-shrink-0">
                                                <IconComponent />
                                            </span>
                                            <span className="font-semibold">{item}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServicesGrid;