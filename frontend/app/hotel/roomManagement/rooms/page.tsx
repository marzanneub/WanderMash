"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { TbChevronLeft, TbTrash } from "react-icons/tb";
import SidebarHotel from "@/components/navigation/sidebarHotel";

export interface Rooms {
    _id?: string;
    roomNumber: number;
    isAvailable: boolean;
    unavailableDates: Date[];
}

export interface RoomTypes {
    _id: string;
    title: string;
    rooms: Rooms[];
}

const HotelRoomsPage: React.FC = () => {
    const router = useRouter();

    const searchParams = useSearchParams();
    const id: string|null  = searchParams.get("_id");

    const [roomTypes, setRoomTypes] = useState<RoomTypes | null>(null);
    const [loading, setLoading] = useState(true);
    
    const [errors, setErrors] = useState<{
        title?: string;
        rooms?: string;
        roomNumber?: string;
        isAvailable?: string;
        unavailableDates?: string;
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
        fetch('/api/get-user-info-for-profile')
            .then(res => res.json())
            .then(data => {
                const allRoomTypes = data.user.roomTypes;
                const targetRoomTypes = allRoomTypes.find((item: RoomTypes) => item._id === id);
                setRoomTypes(targetRoomTypes);

                setLoading(false);
            }
            );
    }, [id]);

    const toggleAvility = async (roomNumber: number, isAvailable: boolean) => {

        const formData = new FormData();
        formData.append("roomNumber", JSON.stringify(roomNumber));
        formData.append("isAvailable", JSON.stringify(!isAvailable));

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/hotel/toggleRoomAvility`, {
            method: "POST",
            body: formData,
            credentials: "include",
        });

        fetch('/api/get-user-info-for-profile')
            .then(res => res.json())
            .then(data => {
            const allRoomTypes = data.user.roomTypes;
            const targetRoomTypes = allRoomTypes.find((item: RoomTypes) => item._id === id);
            setRoomTypes(targetRoomTypes);

            setLoading(false);
        }
        );
    }
    
    //////////////////For adding room///////////////
    const [roomNumber, setRoomNumber] = useState("");

    const resetForm = async() => {
        setRoomNumber("");
    }

    const handleAddRoom = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: typeof errors = {};

        if(!roomNumber) {
            newErrors.roomNumber = "Room Number is required";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length !== 0) return;
        if (!id) return;

        const formData = new FormData();

        formData.append("id", id);
        formData.append("roomNumber", roomNumber);

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/hotel/addRooms`, {
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
                const allRoomTypes = data.user.roomTypes;
                const targetRoomTypes = allRoomTypes.find((item: RoomTypes) => item._id === id);
                setRoomTypes(targetRoomTypes);

                setLoading(false);
            }
            );
            resetForm();

            return;
        }


    }
    /////////////////////////////////////////////////

    return (
        <div className="bg-indigo-50 min-h-screen w-full flex">
            <SidebarHotel pagetype="Room Management" />

            <main className="container mx-auto px-10 py-16 max-w-7xl">
                <div className="flex items-center gap-4 mb-10">
                <button onClick={() => router.back()}
                    className="p-2 bg-white rounded-full shadow-sm text-gray-300 hover:bg-gray-100 hover:text-black transition flex-shrink-0 cursor-pointer">
                    <TbChevronLeft size={24} />
                </button>
                <h1 className="text-4xl font-bold text-indigo-900">Rooms</h1>
                </div>

                {loading && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start animate-pulse">
                        
                        {/* LEFT COLUMN: Add Room Form Skeleton */}
                        <div className="bg-white rounded-2xl shadow-xl p-12 lg:col-span-5 lg:sticky lg:top-10 space-y-6">
                            {/* Header */}
                            <div className="h-8 w-32 bg-gray-200 rounded mb-6" />

                            <div className="space-y-4">
                                {/* Room Number Input Field */}
                                <div>
                                    <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                                    <div className="h-12 w-full bg-gray-200 rounded-md" />
                                </div>

                                {/* Add Button */}
                                <div className="h-12 w-full bg-gray-300 rounded-md mt-4" />
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Existing Rooms List Skeleton */}
                        <div className="lg:col-span-7 space-y-5">
                            {/* Title */}
                            <div className="h-8 w-56 bg-gray-200 rounded mb-2" />

                            {/* Room Row Skeletons */}
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
                                    
                                    {/* Left side: Icon and Name */}
                                    <div className="flex items-center gap-4">
                                        {/* Square Icon */}
                                        <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                                        {/* Unit Text */}
                                        <div className="h-5 w-24 bg-gray-200 rounded" />
                                    </div>

                                    {/* Right side: Toggle and Delete */}
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-3">
                                            {/* Available Text */}
                                            <div className="h-4 w-16 bg-gray-100 rounded" />
                                            {/* Toggle Switch */}
                                            <div className="w-12 h-6 bg-gray-200 rounded-full" />
                                        </div>
                                        {/* Delete Icon */}
                                        <div className="w-5 h-5 bg-gray-200 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!loading && roomTypes && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                        <div className="bg-white rounded-2xl shadow-xl p-12 gap-14 lg:col-span-5 lg:sticky lg:top-10">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                    Add Room
                                </h2>
                            </div>

                            <form  onSubmit={handleAddRoom} className="space-y-4">
                                    <div>
                                        <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700 mb-1">Room Number <span className="text-red-500">*</span></label>
                                        <input
                                            id="roomNumber"
                                            name="roomNumber"
                                            type="number"
                                            // required
                                            placeholder="Enter room number"
                                            value={roomNumber}
                                            onChange={(e) => setRoomNumber(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        {errors.roomNumber && (
                                            <p className="mt-1 text-sm text-red-600">{errors.roomNumber}</p>
                                        )}
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
                                Existing Rooms ({roomTypes.rooms.length})
                            </h2>
                            {(roomTypes.rooms && roomTypes.rooms.length>0) ? (
                                roomTypes.rooms
                                    .slice()
                                    .sort((a, b) => a.roomNumber - b.roomNumber)
                                    .map((room) => (
                                <div key={room._id}  className="bg-white p-6 rounded-2xl border flex gap-6 shadow-sm border-slate-200 justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${room.isAvailable ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                            {room.roomNumber}
                                        </div>
                                        <span className="font-bold text-slate-700">Unit {room.roomNumber}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-3">
                                            <span className={` font-black tracking-tighter ${room.isAvailable ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                {room.isAvailable ? 'Available' : 'Unavailable'}
                                            </span>
                                            <button 
                                                onClick={() => toggleAvility(room.roomNumber!, room.isAvailable)}
                                                className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${room.isAvailable ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                            >
                                                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform ${room.isAvailable ? 'translate-x-6' : 'translate-x-0'}`} />
                                            </button>
                                        </div>
    
                                        <button className="text-slate-300 hover:text-rose-500 transition-colors cursor-pointer">
                                            <TbTrash size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))) : (
                            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center">
                                <h3 className="text-xl font-bold text-slate-700">No rooms defined</h3>
                                <p className="text-slate-500 mt-2 max-w-xs mx-auto text-sm">
                                Your inventory is currently empty. Start by adding room number
                                using the form to begin receiving bookings.
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

export default HotelRoomsPage;