"use client";
import React, { useState } from "react";
import { IconType } from "react-icons";

import { 
  // Existing Restaurant Icons
  FaBus, FaCreditCard, FaWind, FaLeaf, FaGlassMartiniAlt, FaCoffee, FaApplePay, 
  FaBaby, FaMusic, FaBreadSlice, FaChair, FaUmbrellaBeach, FaBiking, 
  FaBirthdayCake, FaGamepad, FaHandsHelping, FaBook, FaBox, FaUtensils, FaShieldAlt, FaMoneyBillWave, 
  FaTruck, FaHandSparkles, FaSmokingBan, FaTshirt, FaBeer, FaMobileAlt, 
  FaTv, FaParking, FaWifi, FaTree, FaCheckCircle, FaWheelchair, FaSmoking, FaTable, 
  FaUserFriends, FaDoorOpen, FaFirstAid, FaRunning, FaPlug, FaRestroom, FaSwimmingPool, 
  FaMosque, FaCrown, FaCarSide, FaChild, FaUsers, FaUser, FaClock, FaDog, 
  FaWineGlassAlt, FaLock,
  // New Hotel Specific Icons (FA)
  FaBell, FaSuitcase, FaBriefcase, FaDice, FaChurch, FaCity, FaConciergeBell, 
  FaBath, FaLaptop, FaKey, FaFire, FaDumbbell, FaSpa, FaGift, FaGolfBall, 
  FaTemperatureHigh, FaHotTub, FaStore, FaLanguage, FaBed, FaUserShield, 
  FaShoePrints, FaSkiing, FaVolumeMute, FaTableTennis, FaTicketAlt, 
  FaMapMarkedAlt, FaCookie, FaWater, FaSwimmer, FaRing
} from "react-icons/fa";

// Font Awesome 6 specific (if using react-icons v4.10+)
import { FaGlassWater, FaPumpSoap } from "react-icons/fa6"; 

import { 
  MdOutlineFastfood, MdOutlineEmojiFoodBeverage, MdElevator,
  // New Hotel Specific Icons (MD)
  MdRoomService, MdDoorBack, MdOutlineBalcony, MdOutlineNightlight, 
  MdOutlineDryCleaning, MdOutlineIron 
} from "react-icons/md";

import { 
  GiWheat, GiCheckMark, 
  // New Hotel Specific Icons (GI)
  GiTennisCourt 
} from "react-icons/gi";

interface ServicesGridProps {
    title: string;
    items: string[];
}

interface FacilityIcon {
  name: string;
  icon: IconType;
}

const hotelFacilityIconList: FacilityIcon[] = [
    { name: "24-Hour Front Desk", icon: FaBell },
    { name: "24-Hour Room Service", icon: MdRoomService },
    { name: "Adjoining Rooms", icon: MdDoorBack },
    { name: "Airport Shuttle", icon: FaBus },
    { name: "Air Conditioning", icon: FaWind },
    { name: "All-Inclusive Options", icon: FaHandsHelping },
    { name: "ATM on Site", icon: FaCreditCard },
    { name: "Babysitting Services", icon: FaBaby },
    { name: "Baggage Storage", icon: FaSuitcase },
    { name: "Balcony/Terrace", icon: MdOutlineBalcony },
    { name: "Bar/Lounge", icon: FaGlassMartiniAlt },
    { name: "Barbecue Grills", icon: FaUtensils },
    { name: "Bathrobes & Slippers", icon: FaTshirt },
    { name: "Beach Access", icon: FaUmbrellaBeach },
    { name: "Beach Umbrellas", icon: FaUmbrellaBeach },
    { name: "Bicycle Rental", icon: FaBiking },
    { name: "Billiard Table", icon: FaGamepad },
    { name: "Blackout Curtains", icon: MdOutlineNightlight },
    { name: "Breakfast Buffet", icon: MdOutlineEmojiFoodBeverage },
    { name: "Business Center", icon: FaBriefcase },
    { name: "Cable/Satellite TV", icon: FaTv },
    { name: "Car Rental Desk", icon: FaCarSide },
    { name: "Casino", icon: FaDice },
    { name: "CCTV in Common Areas", icon: FaShieldAlt },
    { name: "Chapel/Shrine", icon: FaChurch },
    { name: "Children's Play Area", icon: FaChild },
    { name: "City View", icon: FaCity },
    { name: "Coffee Maker in Room", icon: FaCoffee },
    { name: "Complimentary Breakfast", icon: FaUtensils },
    { name: "Complimentary Toiletries", icon: FaPumpSoap },
    { name: "Concierge Service", icon: FaConciergeBell },
    { name: "Conference Rooms", icon: FaUsers },
    { name: "Connecting Rooms", icon: MdDoorBack },
    { name: "Cribs Available", icon: FaBaby },
    { name: "Currency Exchange", icon: FaMoneyBillWave },
    { name: "Daily Housekeeping", icon: FaCheckCircle },
    { name: "Deep Soaking Bathtub", icon: FaBath },
    { name: "Desk/Workspace", icon: FaLaptop },
    { name: "Digital Key Access", icon: FaKey },
    { name: "Dry Cleaning Service", icon: MdOutlineDryCleaning },
    { name: "Electric Kettle", icon: FaCoffee },
    { name: "Elevator", icon: MdElevator },
    { name: "EV Charging Station", icon: FaPlug },
    { name: "Executive Lounge Access", icon: FaCrown },
    { name: "Express Check-in/Check-out", icon: FaRunning },
    { name: "Family Rooms", icon: FaUserFriends },
    { name: "Fire Pit", icon: FaFire },
    { name: "Fireplace in Lobby", icon: FaFire },
    { name: "Fitness Center/Gym", icon: FaDumbbell },
    { name: "Free Bottled Water", icon: FaGlassWater },
    { name: "Free Parking", icon: FaParking },
    { name: "Free Wi-Fi", icon: FaWifi },
    { name: "Full-Service Spa", icon: FaSpa },
    { name: "Game Room", icon: FaGamepad },
    { name: "Garden", icon: FaTree },
    { name: "Gift Shop", icon: FaGift },
    { name: "Golf Course Access", icon: FaGolfBall },
    { name: "Grocery Delivery", icon: FaTruck },
    { name: "Hairdryer", icon: FaWind },
    { name: "Heating", icon: FaTemperatureHigh },
    { name: "High-Speed Internet", icon: FaWifi },
    { name: "Hot Tub/Jacuzzi", icon: FaHotTub },
    { name: "In-Room Safe", icon: FaLock },
    { name: "Indoor Pool", icon: FaSwimmingPool },
    { name: "Infinity Pool", icon: FaSwimmingPool },
    { name: "Infrared Sauna", icon: FaHotTub },
    { name: "Ironing Facilities", icon: MdOutlineIron },
    { name: "Karaoke Room", icon: FaMusic },
    { name: "Kids Club", icon: FaChild },
    { name: "Kids Menu", icon: FaChild },
    { name: "Kitchenette", icon: FaUtensils },
    { name: "Laptop-Friendly Workspace", icon: FaLaptop },
    { name: "Laundry Facilities", icon: FaTshirt },
    { name: "Library", icon: FaBook },
    { name: "Luggage Storage", icon: FaSuitcase },
    { name: "Massage Services", icon: FaSpa },
    { name: "Meeting Facilities", icon: FaUsers },
    { name: "Mini Bar", icon: FaGlassMartiniAlt },
    { name: "Mini Market on Site", icon: FaStore },
    { name: "Multilingual Staff", icon: FaLanguage },
    { name: "Nightclub/DJ", icon: FaMusic },
    { name: "Non-Smoking Rooms", icon: FaSmokingBan },
    { name: "Outdoor Pool", icon: FaSwimmingPool },
    { name: "Outdoor Seating", icon: FaTree },
    { name: "Paid Parking", icon: FaParking },
    { name: "Pillow Menu", icon: FaBed },
    { name: "Pet Friendly", icon: FaDog },
    { name: "Poolside Bar", icon: FaGlassMartiniAlt },
    { name: "Pool Towels", icon: FaTshirt },
    { name: "Private Beach", icon: FaUmbrellaBeach },
    { name: "Private Check-in/Check-out", icon: FaUserShield },
    { name: "Private Entrance", icon: FaDoorOpen },
    { name: "Public Bath", icon: FaBath },
    { name: "Refrigerator", icon: FaBox },
    { name: "Rooftop Terrace", icon: FaTree },
    { name: "Safe Deposit Box", icon: FaLock },
    { name: "Sauna", icon: FaHotTub },
    { name: "Self-Service Laundry", icon: FaTshirt },
    { name: "Shoeshine Service", icon: FaShoePrints },
    { name: "Shuttle Service", icon: FaBus },
    { name: "Ski Storage", icon: FaSkiing },
    { name: "Smart TV", icon: FaTv },
    { name: "Smoking Area", icon: FaSmoking },
    { name: "Soundproof Rooms", icon: FaVolumeMute },
    { name: "Steam Room", icon: FaHotTub },
    { name: "Sun Deck", icon: FaUmbrellaBeach },
    { name: "Swimming Pool", icon: FaSwimmingPool },
    { name: "Table Tennis", icon: FaTableTennis },
    { name: "Tennis Court", icon: GiTennisCourt },
    { name: "Ticket Service", icon: FaTicketAlt },
    { name: "Tour Desk", icon: FaMapMarkedAlt },
    { name: "Turndown Service", icon: FaBed },
    { name: "Underground Parking", icon: FaParking },
    { name: "Valet Parking", icon: FaCarSide },
    { name: "Vending Machines", icon: FaCookie },
    { name: "VIP Room Facilities", icon: FaCrown },
    { name: "Wake-up Service", icon: FaClock },
    { name: "Water Park Access", icon: FaWater },
    { name: "Water Sports Facilities", icon: FaSwimmer },
    { name: "Wedding Services", icon: FaRing },
    { name: "Wheelchair Accessible", icon: FaWheelchair },
    { name: "Wine/Champagne Service", icon: FaWineGlassAlt },
    { name: "Yoga Room", icon: FaSpa }
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
                    const facility = hotelFacilityIconList.find((f) => f.name === item);
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
                                    const facility = hotelFacilityIconList.find((f) => f.name === item);
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