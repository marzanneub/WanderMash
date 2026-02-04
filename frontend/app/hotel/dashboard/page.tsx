"use client";
import React, {useState, useEffect} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import SidebarHotel from "@/components/navigation/sidebarHotel";
import PieChart from "@/components/charts/pie-chart";
import PieChartSkeleton from "@/components/charts/pie-chart-skeleton";

interface GeneralUser {
    name: string;
    phone: string;
}

interface SocialLinks {
    facebook: string;
    instagram: string;
    twitter: string;
}

interface Location {
    latitude: number|null;
    longitude: number|null;
}

interface Policies {
    checkIn: string;
    checkOut: string;
    cancellation: string;
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

interface Rooms {
    _id?: string;
    roomNumber: number;
    isAvailable: boolean;
}

interface Booking {
    _id: string;
    userId: GeneralUser;
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

interface User {
    name: string;
    logo: string;
    email: string;
    registrationId: string;
    phone: string;
    approved: boolean;
    address: string;
    district: string;
    area: string;
    postalCode: number;
    description: string;
    clicks: number;
    socialLinks?: SocialLinks;
    facilities?: string[];
    views?: string[];
    policies: Policies;
    location: Location;
}

const HotelDashboardPage: React.FC = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [generalUser, setGeneralUser] = useState<GeneralUser | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(true);

    const [errors, setErrors] = useState<{
        password?: string;
        newPassword?: string;
        confirmPassword?: string;
        errormessage?: string;
    }>({});

    useEffect(() => {
        fetch('/api/hotel-get-my-info') 
            .then(res => res.json())
            .then(data => {
                setUser(data.user);
                setBookings(data.bookings);
                setLoading(false);
            }
         );
    }, []);

    return (
        <div className="bg-indigo-50 min-h-screen w-full flex">
            <SidebarHotel pagetype="Dashboard" />

            <main className="container mx-auto px-10 py-16 max-w-7xl">
                <h1 className="text-4xl font-bold text-indigo-900 mb-10">Dashboard</h1>

                {loading && (
                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {/* Generate 3 skeleton cards */}
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div 
                        key={i} 
                        className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-pulse"
                        >
                        {/* Label Skeleton */}
                        <div className="h-3 w-24 bg-slate-100 rounded mb-3"></div>
                        
                        {/* Main Number Skeleton */}
                        <div className="flex items-baseline gap-2 mb-3">
                            {/* Icon/Currency Placeholder */}
                            <div className="h-6 w-4 bg-slate-200 rounded"></div>
                            {/* Big Number Placeholder */}
                            <div className="h-8 w-32 bg-slate-200 rounded"></div>
                        </div>
                        
                        {/* Subtext Skeleton */}
                        <div className="h-2 w-20 bg-slate-50 rounded"></div>
                        </div>
                    ))}
                    </div>
                    <PieChartSkeleton />
                </div>
                )}
                {user!==null && (
                    <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-hover hover:shadow-md">
                                <p className="text-slate-500 text-[11px] uppercase font-bold">Total Earnings</p>
                                <p className="text-2xl font-bold text-slate-900">
                                    ৳ {
                                    bookings
                                        .filter((booking) => booking.status === "confirmed")
                                        .reduce((sum, booking) => sum + booking.totalAmount, 0)
                                        .toLocaleString()
                                    }
                                </p>
                                <p className="text-slate-400 text-xs">Net Revenue</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-hover hover:shadow-md">
                                <p className="text-slate-500 text-[11px] uppercase font-bold">Today&apos;s Earnings</p>
                                <p className="text-2xl font-bold text-indigo-600">
                                    ৳ {
                                    bookings
                                        .filter((booking) => {
                                            if (booking.status !== "confirmed") return false;
                                            const bookingDate = new Date(booking.createdAt).toDateString();
                                            const today = new Date().toDateString();
                                            return bookingDate === today;
                                        })
                                        .reduce((sum, booking) => sum + booking.totalAmount, 0)
                                        .toLocaleString()
                                    }
                                </p>
                                <p className="text-slate-400 text-xs">Today&apos;s Revenue</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-hover hover:shadow-md">
                                <p className="text-slate-500 text-[11px] uppercase font-bold">Total Clicks</p>
                                <p className="text-2xl font-bold text-rose-500">
                                    {user.clicks.toLocaleString()}
                                </p>
                                <p className="text-slate-400 text-xs">Visitor Interest</p>
                            </div>

                        </div>

                        <PieChart bookings={bookings}/>

                    </div>
                )}
            </main>

        </div>
    )

}

export default HotelDashboardPage;