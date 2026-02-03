"use client";
import React, {useState, useEffect} from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { 
  LuCalendar, LuBed, LuClock, LuReceipt 
} from "react-icons/lu";

import SidebarGeneralUser from "@/components/navigation/sidebarGeneralUser";

interface User {
    name: string;
    email: string;
    profilePicture: string;
    phone: string;
    bio: string;
}

interface Capacity {
    adults: number;
    children: number;
}

interface BedConfig {
    singleBeds: number;
    doubleBeds: number;
    extraBedsAvailable: boolean;
}

interface Policies {
    checkIn: string;
    checkOut: string;
    cancellation: string;
}

interface Rooms {
    _id?: string;
    roomNumber: number;
    isAvailable: boolean;
}

interface HotelId {
    _id: string;
    name: string;
    address: string;
    district: string;
    area: string;
    policies: Policies;
}

interface Booking {
    _id: string;
    hotelId: HotelId;
    roomTitle: string;
    bedConfig: BedConfig;
    capacity: Capacity;
    roomSize: string;
    pricePerNight: number;
    roomNumber: number;
    furnishings: string[];
    amenities: string[];
    checkInDate: Date;
    checkOutDate: Date;
    totalAmount: number;
    status: string;
    createdAt: Date;
}

const currentTime = Date.now();

const GeneralUserBookingsPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    const searchParams = useSearchParams();
    const warnmessage  = searchParams.get("warnmessage");
    const successmessage  = searchParams.get("successmessage");
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
        fetch('/api/generalUser-get-my-info') 
            .then(res => res.json())
            .then(data => {
                setBookings(data.bookings);
                setLoading(false);
            }
         );
    }, []);

    const getStatusStyles = (status: string) => {
        switch (status) {
        case "confirmed": return "bg-emerald-50 text-emerald-600 border-emerald-100";
        case "cancelled": return "bg-rose-50 text-rose-600 border-rose-100";
        default: return "bg-slate-50 text-slate-600 border-slate-100";
        }
    };

    const cancelBooking = async (bookingId: string) => {

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/generalUser/cancelHotelBooking`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ bookingId }),
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

            fetch('/api/generalUser-get-my-info') 
                .then(res => res.json())
                .then(data => {
                    setBookings(data.bookings);
                    setLoading(false);
                }
            );

            return;
        }
    }

    return (
        <div className="bg-indigo-50 min-h-screen w-full flex">
            <SidebarGeneralUser pagetype="Bookings" />

            <main className="container mx-auto px-10 py-16 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 md:justify-between">
                    <h1 className="md:col-span-2 text-4xl font-bold text-indigo-900 mb-10">Your Bookings</h1>

                    
                    <div className="flex bg-white grid grid-cols-1 sm:grid-cols-3 rounded-2xl mb-10">
                        {["all", "confirmed", "cancelled"].map((t) => (
                            <button
                            key={t}
                            onClick={() => setFilter(t)}
                            className={`px-6 py-2 rounded-2xl text-sm font-bold capitalize transition-all 
                            ${filter === t ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}
                            cursor-pointer`}
                        >
                            {t}
                        </button>
                        ))}
                    </div>
                </div>


                {loading && (
                    <div className="space-y-5 animate-pulse">
                    {[...Array(3)].map((_, i) => (
                        <div 
                        key={i} 
                        className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm"
                        >
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Left Content Side */}
                            <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                                {/* Status Badge Skeleton */}
                                <div className="h-5 w-20 bg-slate-200 rounded-full"></div>
                                {/* ID Skeleton */}
                                <div className="h-3 w-24 bg-slate-100 rounded"></div>
                            </div>
                            
                            {/* Date Booked Skeleton */}
                            <div className="h-3 w-40 bg-slate-100 rounded mb-4"></div>

                            <div className="mb-2">
                                {/* Room Title Skeleton */}
                                <div className="h-6 w-3/4 bg-slate-200 rounded mb-2"></div>
                                {/* Hotel Name Skeleton */}
                                <div className="h-4 w-1/2 bg-indigo-50 rounded mb-2"></div>
                                {/* Address Skeleton */}
                                <div className="space-y-1">
                                <div className="h-3 w-1/3 bg-slate-100 rounded"></div>
                                <div className="h-3 w-1/4 bg-slate-50 rounded"></div>
                                </div>
                            </div>

                            {/* Icons/Details Row Skeleton */}
                            <div className="flex gap-x-5 mt-4">
                                <div className="h-4 w-20 bg-slate-100 rounded"></div>
                                <div className="h-4 w-32 bg-slate-100 rounded"></div>
                            </div>
                            </div>

                            {/* Right Price Side */}
                            <div className="md:w-44 flex flex-col justify-between md:border-l border-slate-50 md:pl-6 pt-4 md:pt-0">
                            <div>
                                <div className="h-3 w-16 bg-slate-100 rounded mb-2"></div>
                                <div className="h-8 w-24 bg-slate-200 rounded"></div>
                            </div>
                            
                            <div className="mt-4">
                                <div className="h-4 w-full bg-slate-100 rounded"></div>
                            </div>
                            </div>
                        </div>
                        </div>
                    ))}
                    </div>

                )}
                
                {!loading &&  (
                // <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row gap-10">
                <div className="space-y-5">
                
                {bookings.map((booking) => {
                    if(filter === "all" || filter === booking.status) {
                        return (
                        <div 
                        key={booking._id} 
                        className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 shadow-sm"
                        >
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyles(booking.status)}`}>
                                    {booking.status}
                                    </span>
                                    <span className="text-slate-400 text-xs">#{booking._id}</span>
                                </div>
                                
                                <span className="text-slate-400 text-[10px] font-medium">
                                    Booked on: {new Date(booking.createdAt).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: true
                                    })}
                                </span>

                                <div className="mb-2">
                                    <h2 className="text-xl font-bold text-slate-800 leading-tight">
                                        {booking.roomTitle}
                                    </h2>
                                    <Link
                                        href={`/hotels/preview?id=${booking.hotelId._id}`}
                                        className="text-indigo-600 font-semibold text-sm cursor-pointer">
                                        {booking.hotelId.name}
                                    </Link>
                                    <p className="text-slate-500 text-xs mt-1">
                                        <span className="font-medium text-slate-700">{booking.hotelId.area}, {booking.hotelId.district}</span>
                                        <br />
                                        <span className="italic">{booking.hotelId.address}</span>
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500 mt-2">
                                    <span className="flex items-center gap-1.5"><LuBed className="text-slate-400" /> Room {booking.roomNumber}</span>
                                    <span className="flex items-center gap-1.5">
                                    <LuCalendar className="text-slate-400" /> 
                                    {new Date(booking.checkInDate).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                      —  
                                    {new Date(booking.checkOutDate).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                    </span>
                                </div>
                            </div>

                            <div className="md:w-44 flex flex-col justify-between md:border-l border-slate-100 md:pl-6 pt-4 md:pt-0">
                                <div>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase">Total Price</p>
                                    <h3 className="text-2xl font-bold text-slate-900">৳{booking.totalAmount}</h3>
                                </div>

                                <div className="flex flex-col gap-2 mt-4">
                                    {booking.status === "confirmed" && booking.hotelId.policies.cancellation === "Flexible" && (new Date(booking.checkInDate).getTime()>currentTime) && (
                                    <button
                                    onClick={() => cancelBooking(booking._id)}
                                    className="text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors py-1 cursor-pointer"
                                    >
                                        Cancel Booking
                                    </button>
                                    )}
                                    {booking.status === "confirmed" && booking.hotelId.policies.cancellation === "Fixed" && (new Date(booking.checkInDate).getTime()>currentTime) && (
                                    <button
                                    className="text-xs font-bold text-slate-400 hover:line-through transition-colors py-1 cursor-pointer"
                                    >
                                        No Cancellation
                                    </button>
                                    )}
                                </div>
                                            
                            </div>

                        </div>
                        </div>
                        );
                    }
                })}

                </div>)}
            </main>

        </div>
    )
}

export default GeneralUserBookingsPage;