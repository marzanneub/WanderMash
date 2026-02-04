"use client";
import React, {useState, useEffect} from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import SidebarAdmin from "@/components/navigation/sidebarAdmin";

interface Attraction {
    _id: string;
    name: string;
}

interface GeneralUser {
    _id: string;
    name: string;
}

interface Hotel {
    _id: string;
    name: string;
}

interface HotelBooking {
    _id: string;
}

interface Restaurant {
    _id: string;
    name: string;
}

interface TourismManager {
    _id: string;
    name: string;
}


const AdminPanelPage: React.FC = () => {
    const [attractions, setAttractions] = useState<Attraction[]>([]);
    const [generalUsers, setGeneralUsers] = useState<GeneralUser[]>([]);
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [hotelBookings, setHotelBookings] = useState<HotelBooking[]>([]);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [tourismManagers, setTourismManagers] = useState<TourismManager[]>([]);
    
    const [loading, setLoading] = useState(true);

    const searchParams = useSearchParams();
    const warnmessage  = searchParams.get("warnmessage");
    const successmessage  = searchParams.get("successmessage");
    const errormessage  = searchParams.get("errormessage");
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
        toast.error(errormessage, {
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
        fetch('/api/admin-get-dashboard-info') 
            .then(res => res.json())
            .then(data => {
                setLoading(false);
            }
         );
    }, []);

    return (
        <div className="bg-indigo-50 min-h-screen w-full flex">
            <SidebarAdmin pagetype="Dashboard" />

            <main className="container mx-auto px-10 py-16 max-w-7xl">
                <h1 className="text-4xl font-bold text-indigo-900 mb-10">Dashboard</h1>
                
                {loading && (
                    <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row gap-10 animate-pulse">

                    </div>

                )}
                
                {!loading && (
                <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row gap-10">


                </div>)}
            </main>

        </div>
    )
}

export default AdminPanelPage;