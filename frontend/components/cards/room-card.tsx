"use client";
import React, { useState } from "react";
import { IconType } from "react-icons";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaBed, FaPlane, FaFish, FaMountain, FaArchway, FaTree, FaWater, FaShip, FaUmbrellaBeach, FaSuitcase, FaBreadSlice,
  FaLandmark, FaCity, FaSun, FaGolfBall, FaBuilding, FaRoad, FaSkiing, FaWind, FaClock, FaLock, FaWheelchair,
  FaWarehouse, FaChurch, FaMosque, FaHospital, FaUniversity, FaWineGlass, FaCloudSun, FaMobileAlt, FaKey,
  FaCouch, FaShower, FaToilet, FaTv, FaWifi, FaBluetooth, FaPlug, FaMicrophone, FaTshirt, FaShoePrints,
  FaCoffee, FaUtensils, FaBriefcase, FaShieldAlt, FaSnowflake, FaFan, FaBell, FaLeaf, FaBath, FaFirstAid,
  FaVolumeMute, FaWindowMaximize, FaLightbulb, FaTemperatureHigh, FaWineGlassAlt, FaHotTub,
  FaGlassMartiniAlt,
  FaChevronLeft, FaChevronRight, FaUserFriends
} from "react-icons/fa";
import { FaGlassWater, FaPumpSoap, FaVault, FaLaptop } from "react-icons/fa6";
import { GiCheckMark, GiForest, GiWaterfall, GiFlowerPot, GiIsland, GiField } from "react-icons/gi";
import { 
  MdOutlineWaves, MdOutlineNaturePeople, MdOutlineStorefront, MdOutlineBedroomParent, 
  MdOutlineDeck, MdOutlineLocalFireDepartment, MdOutlineIron, MdWindow, MdOutlineBalcony,
  MdOutlineSettingsInputAntenna, MdOutlineSoupKitchen, MdOutlineDinnerDining,
  MdOutlineNightlight, MdOutlineChair, MdOutlineLocalDrink, MdOutlineKitchen
} from "react-icons/md";
import { TbArrowsMaximize } from "react-icons/tb";

interface AmenityIcon {
  name: string;
  icon: IconType;
}

export const roomAmenityIconList: AmenityIcon[] = [
  // Sleeping & Comfort
  { name: "Premium Bedding", icon: FaBed },
  { name: "Memory Foam Mattress", icon: FaBed },
  { name: "Pillow Menu", icon: FaBed },
  { name: "Blackout Curtains", icon: MdOutlineNightlight },
  { name: "Soundproof Walls", icon: FaVolumeMute },
  { name: "Hypoallergenic Bedding", icon: FaLeaf },
  { name: "Extra Linens & Towels", icon: FaTshirt },
  { name: "Fold-out Sofa", icon: FaCouch },

  // Bathroom & Personal Care
  { name: "En-suite Bathroom", icon: FaBath },
  { name: "Rainfall Showerhead", icon: FaShower },
  { name: "Deep Soaking Bathtub", icon: FaBath },
  { name: "Jacuzzi Tub", icon: FaHotTub },
  { name: "Walk-in Shower", icon: FaShower },
  { name: "Bidet", icon: FaToilet },
  { name: "Dual Vanities", icon: FaBath },
  { name: "Hairdryer", icon: FaWind },
  { name: "Lighted Makeup Mirror", icon: MdWindow },
  { name: "Designer Toiletries", icon: FaPumpSoap },
  { name: "Plush Bathrobes", icon: FaTshirt },
  { name: "Slippers", icon: FaShoePrints },
  { name: "Heated Towel Rail", icon: FaTemperatureHigh },

  // Technology & Entertainment
  { name: "High-Speed Wi-Fi", icon: FaWifi },
  { name: "Smart TV with Streaming (Netflix/HBOMax)", icon: FaTv },
  { name: "Cable/Satellite Channels", icon: MdOutlineSettingsInputAntenna },
  { name: "Bluetooth Speaker", icon: FaBluetooth },
  { name: "Charging Station", icon: FaPlug },
  { name: "USB Charging Ports", icon: FaPlug },
  { name: "Bedside Power Outlets", icon: FaPlug },
  { name: "Telephone", icon: FaMobileAlt },
  { name: "Radio/Alarm Clock", icon: FaClock },

  // Food & Drink
  { name: "Mini Bar", icon: FaGlassMartiniAlt },
  { name: "Refrigerator", icon: MdOutlineKitchen },
  { name: "Microwave", icon: MdOutlineSoupKitchen },
  { name: "Coffee/Tea Maker", icon: FaCoffee },
  { name: "Nespresso Machine", icon: FaCoffee },
  { name: "Electric Kettle", icon: FaCoffee },
  { name: "Complimentary Bottled Water", icon: FaGlassWater },
  { name: "Wine Glasses & Opener", icon: FaWineGlassAlt },
  { name: "Kitchenette", icon: FaUtensils },
  { name: "Stovetop", icon: FaUtensils },
  { name: "Toaster", icon: FaBreadSlice },
  { name: "Dining Table", icon: MdOutlineDinnerDining },

  // Workspace & Storage
  { name: "Desk/Workspace", icon: FaLaptop },
  { name: "Ergonomic Chair", icon: MdOutlineChair },
  { name: "In-Room Safe (Laptop Size)", icon: FaLock },
  { name: "Wardrobe/Closet", icon: FaBriefcase },
  { name: "Clothes Rack", icon: FaTshirt },
  { name: "Luggage Rack", icon: FaSuitcase },
  { name: "Iron & Ironing Board", icon: MdOutlineIron },
  { name: "Full-Length Mirror", icon: MdWindow },

  // Climate Control & Views
  { name: "Individually Controlled AC", icon: FaSnowflake },
  { name: "Central Heating", icon: FaTemperatureHigh },
  { name: "Ceiling Fan", icon: FaFan },
  { name: "Fresh Air Windows", icon: FaWindowMaximize },
  { name: "Private Balcony", icon: MdOutlineBalcony },
  { name: "Terrace Access", icon: MdOutlineDeck },
  { name: "Patio", icon: FaTree },
  { name: "City View", icon: FaCity },
  { name: "Sea/Ocean View", icon: FaWater },
  { name: "Garden View", icon: FaTree },

  // Safety & Accessibility
  { name: "Smoke Detector", icon: FaShieldAlt },
  { name: "Emergency Cord in Bathroom", icon: FaFirstAid },
  { name: "Grab Rails in Toilet", icon: FaWheelchair },
  { name: "Lowered Sink", icon: FaWheelchair },
  { name: "Visual Fire Alarm", icon: FaBell },
  { name: "Electronic Door Key", icon: FaKey }
];

interface Capacity {
    adults: number;
    children: number;
}

interface BedConfig {
    singleBeds: number;
    doubleBeds: number;
    extraBedsAvailable: boolean;
}

interface Rooms {
    _id?: string;
    roomNumber: number;
    isAvailable: boolean;
    unavailableDates: Date[];
}

interface RoomTypes {
    _id: string;
    title: string;
    pricePerNight: number;
    dp: string;
    capacity: Capacity;
    bedConfig: BedConfig;
    roomSize: string;
    furnishings: string[];
    amenities: string[];
    description: string;
    images: string[];
    rooms: Rooms[];
}

interface RoomCardProps {
    item: RoomTypes;
    children: React.ReactNode;
}

export const RoomCard: React.FC<RoomCardProps> = ({item, children}) => {

  const [furnishingsOpen, setFurnishingsOpen] = useState(false);
  const [amenitiesOpen, setAmenitiesOpen] = useState(false);

  const images = item.images;
  const [imageIndex, setImageIndex] = useState(-1);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg flex flex-col md:flex-row border border-slate-100">
      <div className="md:w-1/3 h-64 md:h-auto bg-slate-200">
        <div className="relative w-full h-[260px] md:h-[300px] overflow-hidden bg-black">
          <AnimatePresence initial={false}>
            <motion.img
              key={imageIndex}
              src={`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/images/${
                images.length > 0 ? (imageIndex<0 ? item.dp :  images[imageIndex]) : item.dp
              }`}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Navigation Buttons */}
          {images.length>1 && (<div><button
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-white/30 p-2 rounded-full hover:bg-white/50 transition cursor-pointer"
            onClick={() => {
              if((imageIndex<=0)) {setImageIndex(images.length-1)}
              else {setImageIndex(imageIndex-1)}}
            }
          ><FaChevronLeft size={24} />
          </button>
          <button
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-white/30 p-2 rounded-full hover:bg-white/50 transition cursor-pointer"
            onClick={() => {
              if((imageIndex === (images.length-1))) {setImageIndex(0)}
              else {setImageIndex(imageIndex+1)}}
            }
          ><FaChevronRight size={24} />
          </button></div>)}
        </div>
      </div>

      <div className="p-8 md:w-2/3 flex flex-col justify-between">
          <div>
              <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold text-slate-900">{item.title}</h2>
                  <span className="text-2xl font-black text-indigo-600">${item.pricePerNight}<span className="text-sm text-slate-400 font-medium">/night</span></span>
              </div>
              <p className="text-slate-500 text-sm mb-4 line-clamp-2">{item.description}</p>
              <div className="flex gap-4">
                  <div className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded">
                      <span className="flex items-center gap-1.5 flex-shrink-0">
                          <TbArrowsMaximize className="text-sm" /> 
                          {item.roomSize} sq ft
                      </span>
                  </div>
                  <div className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded">
                      <span className="flex items-center gap-1.5 flex-shrink-0">
                      <FaUserFriends className="text-sm" />
                      Max {item.capacity?.adults} Adults and {item.capacity?.children} Childs
                      </span>
                  </div>
              </div>
              <div>
                <button
                    onClick={() => setFurnishingsOpen(true)}
                    className="mt-3 flex items-center gap-2 text-indigo-600 font-bold text-sm hover:text-indigo-800 transition-colors group cursor-pointer"
                >
                    <span>Furnishings</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {furnishingsOpen && (
                  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                          
                          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                              <h2 className="text-xl font-bold text-indigo-900">Furnishings</h2>
                              <button
                                  onClick={() => setFurnishingsOpen(false)}
                                  className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors cursor-pointer"
                              >
                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                              </button>
                          </div>

                          <div className="p-6 overflow-y-auto">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {item.furnishings.map((furnishing, index) => (
                                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-indigo-50 bg-indigo-50/30 text-slate-700">
                                          <span className="font-semibold">{furnishing}</span>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>
                  </div>
                )}

                <button
                    onClick={() => setAmenitiesOpen(true)}
                    className="mt-3 flex items-center gap-2 text-indigo-600 font-bold text-sm hover:text-indigo-800 transition-colors group cursor-pointer"
                >
                    <span>Amenities</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {amenitiesOpen && (
                  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                          
                          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                              <h2 className="text-xl font-bold text-indigo-900">Amenities</h2>
                              <button
                                  onClick={() => setAmenitiesOpen(false)}
                                  className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors cursor-pointer"
                              >
                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                              </button>
                          </div>

                          <div className="p-6 overflow-y-auto">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {item.amenities.map((amenity, index) => {
                                    const amenityIcon = roomAmenityIconList.find((f) => f.name === amenity);
                                    const IconComponent = amenityIcon?.icon || GiCheckMark;

                                    return (<div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-indigo-50 bg-indigo-50/30 text-slate-700">
                                      <span className="text-indigo-500 flex-shrink-0">
                                        <IconComponent />
                                      </span>
                                      <span className="font-semibold">{amenity}</span>
                                    </div>)
                                  })}
                              </div>
                          </div>
                      </div>
                  </div>
                )}

              </div>
              {/* <div className="flex flex-wrap gap-2 mb-6">
                  {item.amenities.slice(0, 4).map((amenity, i) => (
                      <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100">
                          {amenity}
                      </span>
                  ))}
              </div> */}
          </div>
          {children}
          
      </div>

    </div>
  );
};