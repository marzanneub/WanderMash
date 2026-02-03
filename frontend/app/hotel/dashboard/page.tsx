"use client";
import React, {useState, useEffect} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import SidebarHotel from "@/components/navigation/sidebarHotel";

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
    socialLinks?: SocialLinks;
    facilities?: string[];
    views?: string[];
    policies: Policies;
    location: Location;
}

const HotelDashboardPage: React.FC = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
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
        fetch('/api/get-user-info-for-profile') 
            .then(res => res.json())
            .then(data => {
                setUser(data.user);
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
                    <div className="bg-white rounded-xl shadow-lg p-8 space-y-8 animate-pulse">
                        
                    </div>
                )}
                {user!==null && (
                    <div>

                    </div>
                )}
            </main>

        </div>
    )

}

export default HotelDashboardPage;