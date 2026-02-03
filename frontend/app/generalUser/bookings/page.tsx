"use client";
import React, {useState, useEffect} from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import SidebarGeneralUser from "@/components/navigation/sidebarGeneralUser";

interface User {
    name: string;
    email: string;
    profilePicture: string;
    phone: string;
    bio: string;
}

const GeneralUserBookingsPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
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
            <SidebarGeneralUser pagetype="Bookings" />

            <main className="container mx-auto px-10 py-16 max-w-7xl">
                <h1 className="text-4xl font-bold text-indigo-900 mb-10">Your Bookings</h1>
                
                {loading && (
                    <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row gap-10 animate-pulse">
                    </div>

                )}
                
                {user!==null && (
                <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row gap-10">
                </div>)}
            </main>

        </div>
    )
}

export default GeneralUserBookingsPage;