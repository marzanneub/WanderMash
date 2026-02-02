"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { TbChevronLeft } from "react-icons/tb";
import Cropper, { Area, Point } from "react-easy-crop";
import getCroppedImg from "@/utils/cropImage";
import SidebarHotel from "@/components/navigation/sidebarHotel";
import { roomAmenities, roomFurnishings } from "@/data/user/hotel";

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

export interface RoomType {
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
    name: string;
    logo: string;
    phone: string;
    roomType?: RoomType[];
}

const HotelRoomsEditPage: React.FC = () => {
    const router = useRouter();

    const searchParams = useSearchParams();
    const id: string|null  = searchParams.get("_id");

    const [roomType, setRoomType] = useState<RoomType | null>(null);
    const [title, setTitle] = useState("");
    const [pricePerNight, setPricePerNight] = useState("");
    const [capacity, setCapacity] = useState<Capacity>({adults: 1, children: 0});
    const [bedConfig, setBedConfig] = useState<BedConfig>({singleBeds: 1, doubleBeds:0, extraBedsAvailable: false});
    const [roomSize, setRoomSize] = useState("");
    const [furnishings, setFurnishings] = useState<string[]>([]);
    const [amenities, setAmenities] = useState<string[]>([]);
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(true);

    const [errors, setErrors] = useState<{
        roomTypes?: string;
        title?: string;
        pricePerNight?: string;
        capacity?: string;
        bedConfig?: string;
        roomSize?: string;
        furnishings?: string;
        amenities?: string;
        description?: string;
        errormessage?: string;
    }>({});


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
        fetch(`/api/hotel-get-roomType?id=${id}`)
            .then(res => res.json())
            .then(data => {
                setRoomType(data.roomType);

                setTitle(data.roomType.title);
                setPricePerNight(JSON.stringify(data.roomType.pricePerNight));
                setCapacity(data.roomType.capacity);
                setBedConfig(data.roomType.bedConfig);
                setRoomSize(data.roomType.roomSize);
                setFurnishings(data.roomType.furnishings);
                setAmenities(data.roomType.amenities);
                setDescription(data.roomType.description);

                setLoading(false);
            }
            );
    }, []);

/////////////////for furnishings/////////////////
    const handleFurnishingsCheckboxChange = (option: string) => {
        if (furnishings.includes(option)) {
            setFurnishings(furnishings.filter(item => item !== option));
        } else {
            setFurnishings([...furnishings, option]);
        }
    };
/////////////////////////////////////////////////

/////////////////for amenities/////////////////
    const handleAmenitiesCheckboxChange = (option: string) => {
        if (amenities.includes(option)) {
            setAmenities(amenities.filter(item => item !== option));
        } else {
            setAmenities([...amenities, option]);
        }
    };
/////////////////////////////////////////////////

    const handleSubmit = async (e: React.FormEvent) => {
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
        
        if(description.length > 100) {
            newErrors.description = "Description will contain maximum 100 characters.";
        }
        
        setErrors(newErrors);
        if (Object.keys(newErrors).length !== 0) return;
        if (!id) return;

        const formData = new FormData();

        formData.append("id", id);
        formData.append("title", title);
        formData.append("pricePerNight", pricePerNight);
        formData.append("capacity", JSON.stringify(capacity));
        formData.append("bedConfig", JSON.stringify(bedConfig));
        formData.append("roomSize", roomSize);
        formData.append("furnishings", JSON.stringify(furnishings));
        formData.append("amenities", JSON.stringify(amenities));
        formData.append("description", description);

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/hotel/editRoomTypes`, {
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

            fetch(`/api/hotel-get-roomType?id=${id}`)
                .then(res => res.json())
                .then(data => {
                    setRoomType(data.roomType);

                    setTitle(data.roomType.title);
                    setPricePerNight(JSON.stringify(data.roomType.pricePerNight));
                    setCapacity(data.roomType.capacity);
                    setBedConfig(data.roomType.bedConfig);
                    setRoomSize(data.roomType.roomSize);
                    setFurnishings(data.roomType.furnishings);
                    setAmenities(data.roomType.amenities);
                    setDescription(data.roomType.description);
                }
            );

            return;
        }

    }

    return (
        <div className="bg-indigo-50 min-h-screen w-full flex">
            <SidebarHotel pagetype="Room Management" />

            <main className="container mx-auto px-10 py-16 max-w-7xl">
                <div className="flex items-center gap-4 mb-10">
                <button onClick={() => router.back()}
                    className="p-2 bg-white rounded-full shadow-sm text-gray-300 hover:bg-gray-100 hover:text-black transition flex-shrink-0 cursor-pointer">
                    <TbChevronLeft size={24} />
                </button>
                <h1 className="text-4xl font-bold text-indigo-900">Edit Room</h1>
                </div>

                {loading && (
                    <div className="bg-white rounded-xl shadow-lg p-8 space-y-8 animate-pulse">
                        
                        {/* Basic Info: 3-column grid to match title, price, size */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                    <div className="h-12 w-full bg-gray-100 rounded-md"></div>
                                </div>
                            ))}
                        </div>

                        {/* Description: Full width input */}
                        <div className="space-y-2">
                            <div className="h-4 w-28 bg-gray-200 rounded"></div>
                            <div className="h-12 w-full bg-gray-100 rounded-md"></div>
                        </div>

                        {/* Bed & Capacity Counters: 4-column grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                                    <div className="h-12 w-full bg-gray-100 rounded-lg"></div>
                                </div>
                            ))}
                        </div>

                        {/* Amenities Section */}
                        <div className="border border-gray-200 rounded-md p-6 space-y-6">
                            <div className="h-5 w-32 bg-gray-200 rounded"></div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="flex items-center space-x-2">
                                        <div className="h-4 w-4 bg-gray-200 rounded"></div>
                                        <div className="h-4 w-20 bg-gray-100 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Furnishings Section */}
                        <div className="border border-gray-200 rounded-md p-6 space-y-6">
                            <div className="h-5 w-32 bg-gray-200 rounded"></div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="flex items-center space-x-2">
                                        <div className="h-4 w-4 bg-gray-200 rounded"></div>
                                        <div className="h-4 w-20 bg-gray-100 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex justify-between items-center">
                            <div className="h-11 w-24 bg-gray-200 rounded-md"></div>
                            <div className="h-11 w-32 bg-gray-200 rounded-md"></div>
                        </div>
                    </div>
                )}

                {roomType!==null && (
                <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description </label>
                            <input
                                id="description"
                                name="description"
                                type="text"
                                // required
                                placeholder="description"
                                value={description||""}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                            )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
                        </div>
                        {errors.bedConfig && (
                            <p className="mt-1 text-sm text-red-600">{errors.bedConfig}</p>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
                            {errors.capacity && (
                                <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>
                            )}
                        </div>
                        
                        {/* amenities */}
                        <fieldset className="border border-gray-300 rounded-md p-6">
                            <legend className="text-indigo-900 font-semibold">Amenities</legend>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-4 gap-x-2 text-indigo-900 text-sm">
                                {roomAmenities.map((option) => (
                                    <label
                                        key={option}
                                        className="inline-flex items-center space-x-2 cursor-pointer hover:text-indigo-600 transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            checked={amenities.includes(option)}
                                            onChange={() => handleAmenitiesCheckboxChange(option)}
                                        />
                                        <span>{option}</span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        {/* furnishings */}
                        <fieldset className="border border-gray-300 rounded-md p-6">
                            <legend className="text-indigo-900 font-semibold">Furnishings</legend>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-4 gap-x-2 text-indigo-900 text-sm">
                                {roomFurnishings.map((option) => (
                                    <label
                                        key={option}
                                        className="inline-flex items-center space-x-2 cursor-pointer hover:text-indigo-600 transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            checked={furnishings.includes(option)}
                                            onChange={() => handleFurnishingsCheckboxChange(option)}
                                        />
                                        <span>{option}</span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        <div className="flex justify-between items-center">
                            <Link href={`/hotel/roomManagement?warnmessage=${"Nothing Changed"}`}>
                                <button className="px-4 py-3 text-indigo-600 hover:bg-gray-100 font-semibold rounded-md shadow-md transition cursor-pointer">
                                    Cancel
                                </button>
                            </Link>

                            <button type="submit"
                                className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold border rounded-md shadow-md transition cursor-pointer">
                                Save Changes
                            </button>
                        </div>

                    </form>
                </div>
                )}

            </main>

        </div>
    )
}

export default HotelRoomsEditPage;