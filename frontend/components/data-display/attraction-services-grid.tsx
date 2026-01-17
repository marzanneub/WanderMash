"use client";
import React, { useState, useMemo } from "react";
import { IconType } from "react-icons";
import { 
    FaTree, FaBinoculars, FaCompass, FaCamera, FaFirstAid, FaParking, 
    FaRestroom, FaHiking, FaMountain, FaBiking, FaWater, FaStore, 
    FaWifi, FaTicketAlt, FaInfoCircle, FaWheelchair, FaBus, FaHistory, 
    FaBook, FaTheaterMasks, FaMusic, FaUtensils, FaPray, 
    FaHeartbeat, FaSpa, FaSwimmingPool, FaChild, FaPaw, 
    FaFire, FaLock, FaTv, FaUserShield, FaHome, FaShieldAlt, FaShip,
    FaMapMarkedAlt, FaBiohazard, FaMicrochip, FaUniversity, FaGopuram,
    FaHandsHelping, FaLaptopCode, FaCogs, FaSolarPanel
} from "react-icons/fa";
import { 
    FaTent,
} from "react-icons/fa6";
import { MdAirplanemodeActive, MdOutlineEmojiEvents, MdOutlineMuseum, MdOutlineCastForEducation, MdOutlineNaturePeople, MdSelfImprovement } from "react-icons/md";
import { GiWatchtower, GiCheckMark, GiRaft, GiCaveEntrance, GiAncientColumns } from "react-icons/gi";
import { attractionFacilities } from "@/data/attractions";

interface ServicesGridProps {
    title: string;
    items: string[];
}

interface FacilityIcon {
  name: string;
  icon: IconType;
}

const getIcon = (name: string): IconType => {
    const n = name.toLowerCase();

    if (n === "museum" || n.includes("historical archive")) return MdOutlineMuseum;
    if (n.includes("zipline")) return MdAirplanemodeActive; 
    if (n.includes("meditation") || n.includes("yoga")) return MdSelfImprovement;
    if (n.includes("camp") || n.includes("tent")) return FaTent;
    if (n.includes("watch tower") || n.includes("observation tower")) return GiWatchtower;
    if (n.includes("ancient") || n.includes("archaeological")) return GiAncientColumns;

    if (/water|boat|jetty|river|kayak|raft|fishing|beach|swimming|pool|port/.test(n)) return FaWater;
    if (/nature|tree|forest|eco|garden|wildlife|bird|animal|safari|farm/.test(n)) return FaTree;
    if (/trail|trekking|hiking|climbing|mountain|adventure|biking|cycling/.test(n)) return FaHiking;
    if (/history|heritage|relic|culture|folk|traditional|museum/.test(n)) return FaHistory;
    if (/food|dining|cafe|restaurant|kitchen|cook|tasting|snack|meal/.test(n)) return FaUtensils;
    if (/edu|research|lecture|library|seminar|study|school|workshop/.test(n)) return MdOutlineCastForEducation;
    if (/event|festival|show|stage|performance|concert|music/.test(n)) return MdOutlineEmojiEvents;
    if (/view|photo|camera|observation|deck|scenic|sunset|platform/.test(n)) return FaCamera;
    if (/safety|rescue|shield|security|guard|aid|medical|first aid|fire/.test(n)) return FaShieldAlt;
    if (/prayer|spiritual|temple|mosque|holy|sacred|ritual/.test(n)) return FaPray;
    if (/parking|bus|transport|airport|shuttle|car|metro/.test(n)) return FaBus;
    if (/shop|market|souvenir|mall|store|craft|gift/.test(n)) return FaStore;
    if (/wellness|health|spa|therapy|massage/.test(n)) return FaSpa;
    if (/wifi|digital|smart|kiosk|charging|mobile|online/.test(n)) return FaWifi;
    if (/child|kids|playground|family/.test(n)) return FaChild;

    return GiCheckMark;
}

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

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap">
                {previewItems.map((item, index) => {
                    const IconComponent = getIcon(item);

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
                                    const IconComponent = getIcon(item);

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
    )
}

export default ServicesGrid;