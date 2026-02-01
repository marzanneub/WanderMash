"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { FaUserFriends } from "react-icons/fa";
import { TbArrowsMaximize } from "react-icons/tb";
import Cropper, { Area, Point } from "react-easy-crop";
import getCroppedImg from "@/utils/cropImage";
import SidebarHotel from "@/components/navigation/sidebarHotel";

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

interface User {
    roomTypes?: RoomTypes[];
    phone: string;
}

const HotelRoomManagementPage: React.FC = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [roomTypes, setRoomTypes] = useState<RoomTypes[] | null>([]);
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(true);

    const [errors, setErrors] = useState<{
        title?: string;
        pricePerNight?: string;
        capacity?: string;
        adults?: string;
        children?: string;
        bedConfig?: string;
        singleBeds?: string;
        doubleBeds?: string;
        extraBedsAvailable?: string;
        roomSize?: string;
        furnishings?: string;
        amenities?: string;
        description?: string;
        images?: string;
        rooms?: string;
        roomNumber?: string;
        isAvailable?: string;
        unavailableDates?: string;
        errormessage?: string;
    }>({});

    const searchParams = useSearchParams();
    const warnmessage = searchParams.get("warnmessage");
    const successmessage = searchParams.get("successmessage");
    useEffect(() => {
        toast.warn(warnmessage, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
        toast.success(successmessage, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    }, []);

    useEffect(() => {
        fetch('/api/get-user-info-for-profile')
            .then(res => res.json())
            .then(data => {
                setUser(data.user);
                setPhone(data.user.phone);
                setRoomTypes(data.user.roomTypes);

                setLoading(false);
            }
            );
    }, []);
    
    const [title, setTitle] = useState("");
    const [pricePerNight, setPricePerNight] = useState("");
    const [roomSize, setRoomSize] = useState("");
    const [capacity, setCapacity] = useState<Capacity>({adults: 1, children: 0});
    const [bedConfig, setBedConfig] = useState<BedConfig>({singleBeds: 1, doubleBeds:0, extraBedsAvailable: false});

    
    /////////////////For deleting items//////////////
    const handleDeleteRoomTypes = async (_id: string) => {
        const formData = new FormData();
        formData.append("id", _id);

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/hotel/deleteRoomTypes`, {
            method: "POST",
            body: formData,
            credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) {
            toast.error(data.errormessage, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            return;
        }
        else {
            toast.success(data.successmessage, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

            fetch('/api/get-user-info-for-profile')
                .then(res => res.json())
                .then(data => {
                    setUser(data.user);
                    setRoomTypes(data.user.roomTypes);
                }
            );

            return;
        }
    }
    /////////////////////////////////////////////////

    //////////////////For adding items///////////////

    const resetForm = async() => {
        setTitle("");
        setPricePerNight("");
        setRoomSize("");
        setBedConfig({singleBeds: 1, doubleBeds:0, extraBedsAvailable: false});
        setCapacity({adults: 1, children: 0});
    }

    const handleAddRoomTypes = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: typeof errors = {};

        if(!title) {
            newErrors.title = "Title is required";
        }

        if(!pricePerNight) {
            newErrors.pricePerNight = "Price per night is required";
        }

        if(!roomSize) {
            newErrors.roomSize = "Room Size is required";
        }

        if((bedConfig.singleBeds+bedConfig.doubleBeds)<=0) {
            newErrors.bedConfig = "Minimum 1 bed is required";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length !== 0) return;

        const formData = new FormData();

        formData.append("title", title);
        formData.append("pricePerNight", pricePerNight);
        formData.append("roomSize", roomSize);

        formData.append("capacity", JSON.stringify(capacity));
        formData.append("bedConfig", JSON.stringify(bedConfig));

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/hotel/addRoomTypes`, {
            method: "POST",
            body: formData,
            credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) {
            toast.error(data.errormessage, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            return;
        }
        else {
            toast.success(data.successmessage, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

            fetch('/api/get-user-info-for-profile')
                .then(res => res.json())
                .then(data => {
                    setUser(data.user);
                    setRoomTypes(data.user.roomTypes);
                }
            );
            resetForm();

            return;
        }

    }

    return (
        <div className="bg-indigo-50 min-h-screen w-full flex">
            <SidebarHotel pagetype="Room Management" />

            <main className="container mx-auto px-10 py-16 max-w-7xl">
                <h1 className="text-4xl font-bold text-indigo-900 mb-10">Room Management</h1>

                
                {loading && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start animate-pulse">
                        
                        {/* LEFT FORM SKELETON (Add Room Type Form) */}
                        <div className="bg-white rounded-2xl shadow-xl p-12 gap-14 lg:col-span-5 lg:sticky lg:top-10 space-y-6">
                            {/* Header */}
                            <div className="h-8 w-48 bg-gray-200 rounded mb-6" />

                            {/* Form Fields Skeletons */}
                            <div className="space-y-5">
                                {/* Title Input */}
                                <div>
                                    <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                                    <div className="h-12 w-full bg-gray-200 rounded-md" />
                                </div>

                                {/* Price and Size Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
                                        <div className="h-12 bg-gray-200 rounded-md" />
                                    </div>
                                    <div>
                                        <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
                                        <div className="h-12 bg-gray-200 rounded-md" />
                                    </div>
                                </div>

                                {/* Bed Configuration Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                                        <div className="h-12 bg-gray-100 rounded-lg" />
                                    </div>
                                    <div>
                                        <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                                        <div className="h-12 bg-gray-100 rounded-lg" />
                                    </div>
                                </div>

                                {/* Capacity Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <div className="h-4 w-28 bg-gray-200 rounded mb-2" />
                                        <div className="h-12 bg-gray-100 rounded-lg" />
                                    </div>
                                    <div>
                                        <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                                        <div className="h-12 bg-gray-100 rounded-lg" />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="h-12 w-full bg-gray-300 rounded-md mt-4" />
                            </div>
                        </div>

                        {/* RIGHT LIST SKELETON (Existing Room Types) */}
                        <div className="lg:col-span-7 space-y-5">
                            {/* Title */}
                            <div className="h-8 w-56 bg-gray-200 rounded mb-2" />

                            {/* Room Card Skeletons */}
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 flex gap-6 shadow-sm">
                                    {/* Room Image Square */}
                                    <div className="w-32 h-32 bg-gray-200 rounded-xl shrink-0" />

                                    {/* Room Content */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="h-6 w-40 bg-gray-200 rounded" />
                                            <div className="h-7 w-20 bg-gray-200 rounded" />
                                        </div>

                                        {/* Badges/Specs */}
                                        <div className="flex gap-3">
                                            <div className="h-6 w-24 bg-gray-100 rounded" />
                                            <div className="h-6 w-40 bg-gray-100 rounded" />
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-4 mt-4 pt-3 border-t border-slate-50">
                                            <div className="h-4 w-20 bg-gray-200 rounded" />
                                            <div className="h-4 w-16 bg-gray-200 rounded" />
                                            <div className="h-4 w-16 bg-gray-200 rounded" />
                                            <div className="h-4 w-16 bg-gray-200 rounded" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                {!loading && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                        <div className="bg-white rounded-2xl shadow-xl p-12 gap-14 lg:col-span-5 lg:sticky lg:top-10">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                    Add Room Type
                                </h2>
                            </div>

                            <form  onSubmit={handleAddRoomTypes} className="space-y-4">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Room title <span className="text-red-500">*</span></label>
                                    <input
                                        id="title"
                                        name="title"
                                        type="text"
                                        // required
                                        placeholder="Room title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                                    )}
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="pricePerNight" className="block text-sm font-medium text-gray-700 mb-1">Price / Night (৳) <span className="text-red-500">*</span></label>
                                        <input
                                            id="pricePerNight"
                                            name="pricePerNight"
                                            type="number"
                                            // required
                                            placeholder="Price per night"
                                            value={pricePerNight}
                                            onChange={(e) => setPricePerNight(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        {errors.pricePerNight && (
                                            <p className="mt-1 text-sm text-red-600">{errors.pricePerNight}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="roomSize" className="block text-sm font-medium text-gray-700 mb-1">Room Size <span className="text-red-500">*</span></label>
                                        <input
                                            id="roomSize"
                                            name="roomSize"
                                            type="number"
                                            // required
                                            placeholder="350 sq ft"
                                            value={roomSize}
                                            onChange={(e) => setRoomSize(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        {errors.roomSize && (
                                            <p className="mt-1 text-sm text-red-600">{errors.roomSize}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label htmlFor="singleBeds" className="block text-sm font-medium text-gray-700 mb-1">Single Beds</label>
                                        <div className="flex items-center justify-between border border-gray-300 rounded-lg p-1 bg-gray-50">
                                        <button
                                            type="button"
                                            onClick={() => setBedConfig(
                                            {
                                                singleBeds: Math.max(0, bedConfig.singleBeds - 1), 
                                                doubleBeds: bedConfig.doubleBeds, 
                                                extraBedsAvailable: bedConfig.extraBedsAvailable
                                            })}
                                            className="w-10 h-10 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-gray-100 text-indigo-600 font-bold transition-colors cursor-pointer"
                                        >
                                            –
                                        </button>
                                        <span className="text-lg font-semibold text-slate-800">{bedConfig.singleBeds}</span>
                                        <button
                                            type="button"
                                            onClick={() => setBedConfig(
                                            {
                                                singleBeds: bedConfig.singleBeds + 1, 
                                                doubleBeds: bedConfig.doubleBeds, 
                                                extraBedsAvailable: bedConfig.extraBedsAvailable
                                            })}
                                            className="w-10 h-10 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-gray-100 text-indigo-600 font-bold transition-colors cursor-pointer"
                                        >
                                            +
                                        </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="doubleBeds" className="block text-sm font-medium text-gray-700 mb-1">Double Beds</label>
                                        <div className="flex items-center justify-between border border-gray-300 rounded-lg p-1 bg-gray-50">
                                        <button
                                            type="button"
                                            onClick={() => setBedConfig(
                                            {
                                                singleBeds: bedConfig.singleBeds, 
                                                doubleBeds: Math.max(0, bedConfig.doubleBeds - 1), 
                                                extraBedsAvailable: bedConfig.extraBedsAvailable
                                            })}
                                            className="w-10 h-10 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-gray-100 text-indigo-600 font-bold transition-colors cursor-pointer"
                                        >
                                            –
                                        </button>
                                        <span className="text-lg font-semibold text-slate-800">{bedConfig.doubleBeds}</span>
                                        <button
                                            type="button"
                                            onClick={() => setBedConfig(
                                            {
                                                singleBeds: bedConfig.singleBeds, 
                                                doubleBeds: bedConfig.doubleBeds + 1, 
                                                extraBedsAvailable: bedConfig.extraBedsAvailable
                                            })}
                                            className="w-10 h-10 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-gray-100 text-indigo-600 font-bold transition-colors cursor-pointer"
                                        >
                                            +
                                        </button>
                                        </div>
                                    </div>
                                    {errors.bedConfig && (
                                        <p className="mt-1 text-sm text-red-600">{errors.bedConfig}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label htmlFor="adults" className="block text-sm font-medium text-gray-700 mb-1">Adults Capacity</label>
                                        <div className="flex items-center justify-between border border-gray-300 rounded-lg p-1 bg-gray-50">
                                        <button
                                            type="button"
                                            onClick={() => setCapacity(
                                            {
                                                adults: Math.max(1, capacity.adults - 1), 
                                                children: capacity.children,
                                            })}
                                            className="w-10 h-10 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-gray-100 text-indigo-600 font-bold transition-colors cursor-pointer"
                                        >
                                            –
                                        </button>
                                        <span className="text-lg font-semibold text-slate-800">{capacity.adults}</span>
                                        <button
                                            type="button"
                                            onClick={() => setCapacity(
                                            {
                                                adults: capacity.adults + 1, 
                                                children: capacity.children,
                                            })}
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
                                            onClick={() => setCapacity(
                                            {
                                                adults:  capacity.adults,
                                                children: Math.max(0, capacity.children - 1),
                                            })}
                                            className="w-10 h-10 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-gray-100 text-indigo-600 font-bold transition-colors cursor-pointer"
                                        >
                                            –
                                        </button>
                                        <span className="text-lg font-semibold text-slate-800">{capacity.children}</span>
                                        <button
                                            type="button"
                                            onClick={() => setCapacity(
                                            {
                                                adults: capacity.adults, 
                                                children: capacity.children + 1,
                                            })}
                                            className="w-10 h-10 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-gray-100 text-indigo-600 font-bold transition-colors cursor-pointer"
                                        >
                                            +
                                        </button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md shadow-md transition cursor-pointer`}
                                >
                                    Add
                                </button>
                            </form>
                        </div>



                        <div className="lg:col-span-7 space-y-5">
                            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                Existing Room Types ({roomTypes?.length})
                            </h2>
                            {(roomTypes && roomTypes.length>0) ? (roomTypes.map((room, index) => (
                            <div key={index}  className="bg-white p-6 rounded-2xl border flex gap-6 shadow-sm border-slate-200">
                                {/* Placeholder for Room Image */}
                                <img src={`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/images/${room.dp}`} className="w-32 h-32 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0 object-cover" alt={room.title}/>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            {/* <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold uppercase">
                                            Active
                                            </span> */}
                                            <h4 className="text-xl font-bold text-slate-800 mt-1">{room.title}</h4>
                                        </div>
                                        <p className="text-indigo-600 font-black text-xl">৳{room.pricePerNight}<span className="text-xs text-slate-400">/night</span></p>
                                    </div>

                                    <div className="flex gap-4 mt-3">
                                        <div className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded">
                                            <span className="flex items-center gap-1.5 flex-shrink-0">
                                                <TbArrowsMaximize className="text-sm" /> 
                                                {room.roomSize} sq ft
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded">
                                            <span className="flex items-center gap-1.5 flex-shrink-0">
                                            <FaUserFriends className="text-sm" />
                                            Max {room.capacity?.adults} Adults and {room.capacity?.children} Childs
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 mt-4 pt-3 border-t border-slate-50">
                                        <Link href={`/hotel/roomManagement/edit?_id=${room._id}`}>
                                        <button className="text-slate-400 hover:text-amber-500 flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer">
                                            Edit Details
                                        </button>
                                        </Link>
                                        <Link href={`/hotel/roomManagement/gallery?_id=${room._id}`}>
                                        <button className="text-slate-400 hover:text-lime-500 flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer">
                                            Gallery
                                        </button>
                                        </Link>
                                        <Link href={`/hotel/roomManagement/rooms?_id=${room._id}`}>
                                        <button className="text-slate-400 hover:text-amber-500 flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer">
                                            Rooms
                                        </button>
                                        </Link>
                                        <button  onClick={() => handleDeleteRoomTypes(room._id)} className="text-slate-400 hover:text-rose-500 flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer">
                                            Delete
                                        </button>
                                    </div>

                                </div>

                            </div>
                            ))
                            ) : (
                            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center">
                                <h3 className="text-xl font-bold text-slate-700">No room types defined</h3>
                                <p className="text-slate-500 mt-2 max-w-xs mx-auto text-sm">
                                Your inventory is currently empty. Start by creating a room type 
                                (like &quot;Deluxe Suite&quot; or &quot;Standard Double&quot;) using the form to begin receiving bookings.
                                </p>
                            </div>
                            )}
                        </div>
                        


                    </div>
                )}

            </main>

        </div>
    )
}

export default HotelRoomManagementPage;