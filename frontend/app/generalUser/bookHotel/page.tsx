"use client";
import React, {useState, useEffect, useMemo} from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { TbChevronLeft } from "react-icons/tb";
import { RoomCard } from "@/components/cards/room-card";

interface User {
    name: string;
    email: string;
    profilePicture: string;
    phone: string;
    bio: string;
}

export interface Capacity {
    adults: number;
    children: number;
}

export interface BedConfig {
    singleBeds: number;
    doubleBeds: number;
    extraBedsAvailable: boolean;
}

export interface Rooms {
    _id?: string;
    roomNumber: number;
    isAvailable: boolean;
    unavailableDates: Date[];
}

export interface RoomTypes {
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

const getDateString = (date: Date) => date.toISOString().split("T")[0];

const GeneralUserSettingsPage: React.FC = () => {
    const router = useRouter();

    const searchParams = useSearchParams();
    const id: string|null  = searchParams.get("_id");

    const [user, setUser] = useState(null);
    const [roomTypes, setRoomTypes] = useState<RoomTypes[]>([]);
    const [filteredRoomTypes, setFilteredRoomTypes] = useState<RoomTypes[]>([]);
    
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");

    const [search, setSearch] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const [errors, setErrors] = useState<{
        checkIn?: string;
        checkOut?: string;
        errormessage?: string;
    }>({});

    useEffect(() => {
        fetch('/api/get-user-info-for-profile') 
        .then(res => res.json())
        .then(data => {
            setUser(data.user);
            }
        );
    }, []);

    useEffect(() => {
        fetch(`/api/get-hotel-rooms?id=${id}`)
            .then(res => res.json())
            .then(data => {
                setRoomTypes(data.roomTypes || []);
                setLoading(false);
            }
        );
    }, [id]);
        
    const today = getDateString(new Date());
    const minCheckOutDate = useMemo(() => {
        const date = new Date(checkIn || today);
        date.setDate(date.getDate() + 1);
        return getDateString(date);
    }, [checkIn]);

    const getRoomTypes = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: typeof errors = {};

        if (!checkIn) {
            newErrors.checkIn = "Check-in date is required";
        }

        if (!checkOut) {
            newErrors.checkOut = "Check-out date is required";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length !== 0) return;
        if (!id) return;

        
        const start = new Date(checkIn);
        const end = new Date(checkOut);

        const results = roomTypes.filter((type) => {
            const fit = type.capacity.adults >= adults && type.capacity.children >= children;
            if (!fit) return false;

            return type.rooms.some((room) => {
                if (!room.isAvailable) return false;

                const overlap = room.unavailableDates.some((dateVal) => {
                    const unavailableDate = new Date(dateVal);
                    return unavailableDate >= start && unavailableDate < end;
                });

                return !overlap;
            });
        });

        setFilteredRoomTypes(results);
        setSearch(true);

    }

    return (
        <div className="bg-indigo-50 min-h-screen w-full flex">
            <main className="container mx-auto px-10 py-16 max-w-7xl">
                <div className="flex items-center gap-4 mb-10">
                <button onClick={() => router.back()}
                    className="p-2 bg-white rounded-full shadow-sm text-gray-300 hover:bg-gray-100 hover:text-black transition flex-shrink-0 cursor-pointer">
                    <TbChevronLeft size={24} />
                </button>
                <h1 className="text-4xl font-bold text-indigo-900">Book Hotel</h1>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 uppercase mb-1">Check-In</label>
                        <input 
                        type="date" 
                        min={today}
                        // value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                        />
                        {errors.checkIn && (
                            <p className="mt-1 text-sm text-red-600">{errors.checkIn}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 uppercase mb-1">Check-Out</label>
                        <input 
                        type="date" 
                        min={minCheckOutDate}
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                        />
                        {errors.checkOut && (
                            <p className="mt-1 text-sm text-red-600">{errors.checkOut}</p>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="adults" className="block text-sm font-medium text-gray-700 mb-1">Adults Capacity</label>
                        <div className="flex items-center justify-between border border-gray-300 rounded-lg p-1 bg-gray-50">
                        <button
                            type="button"
                            onClick={() => setAdults(Math.max(1, adults - 1))}
                            className="w-10 h-10 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-gray-100 text-indigo-600 font-bold transition-colors cursor-pointer"
                        >
                            –
                        </button>
                        <span className="text-lg font-semibold text-slate-800">{adults}</span>
                        <button
                            type="button"
                            onClick={() => setAdults(adults + 1)}
                            className="w-10 h-10 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-gray-100 text-indigo-600 font-bold transition-colors cursor-pointer"
                        >
                            +
                        </button>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="children" className="block text-sm font-medium text-gray-700 mb-1">Children Capacity</label>
                        <div className="flex items-center justify-between border border-gray-300 rounded-lg p-1 bg-gray-50">
                        <button
                            type="button"
                            onClick={() => setChildren(Math.max(0, children - 1))}
                            className="w-10 h-10 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-gray-100 text-indigo-600 font-bold transition-colors cursor-pointer"
                        >
                            –
                        </button>
                        <span className="text-lg font-semibold text-slate-800">{children}</span>
                        <button
                            type="button"
                            onClick={() => setChildren(children + 1)}
                            className="w-10 h-10 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-gray-100 text-indigo-600 font-bold transition-colors cursor-pointer"
                        >
                            +
                        </button>
                        </div>
                    </div>
                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={getRoomTypes}
                            className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold border rounded-md shadow-md transition cursor-pointer">
                            Search
                        </button>
                    </div>
                </div>

                {!search ? (<div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-16 text-center shadow-sm">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                        Ready to find your stay?
                    </h3>
                    <p className="text-slate-500 mt-4 max-w-sm mx-auto text-sm leading-relaxed">
                        Enter your dates and guest details above to explore our luxury rooms and suites.
                    </p>
                </div>) : filteredRoomTypes.length > 0 ? (
                <div className="grid grid-cols-1 gap-8">
                    {filteredRoomTypes.map((type) => (
                        <div key={type._id}>
                            <RoomCard item={type}/>
                        </div>
                    ))}
                </div>
                ) : (<div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-16 text-center shadow-sm">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                        No Rooms Match Your Search
                    </h3>
                    
                    <p className="text-slate-500 mt-4 max-w-sm mx-auto text-sm leading-relaxed">
                        We couldn&apos;t find any rooms that fit your guest count and dates.
                        Try **reducing the number of guests** or **checking different dates** to see more availability.
                    </p>
                </div>)
                }

            </main>
        </div>
    )
}

export default GeneralUserSettingsPage;