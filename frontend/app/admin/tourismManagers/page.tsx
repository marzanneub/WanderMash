"use client";
import React, {useState, useEffect} from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import SidebarAdmin from "@/components/navigation/sidebarAdmin";

interface TourismManager {
    name: string;
    email: string;
    phone: string;
    district: string;
    verified: boolean;
    approved: boolean;
    profilePicture: string;
}

const TourismManagersPage: React.FC = () => {
    const [tourismManagers, setTourismManagers] = useState<TourismManager[] | null>(null);
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
        fetch('/api/admin-get-tourismManagers') 
            .then(res => res.json())
            .then(data => {
                setTourismManagers(data.tourismManagers);
                setLoading(false);
                console.log(data.items);
            }
         );
    }, []);

    return (
        <div className="bg-indigo-50 min-h-screen w-full flex">
            <SidebarAdmin pagetype="Users" />

            <main className="container mx-auto px-10 py-16 max-w-7xl">
                <h1 className="text-4xl font-bold text-indigo-900 mb-10">Tourism Managers</h1>
                
                {loading && (
                    <div>

                    </div>

                )}
                
                {tourismManagers!==null && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                        <div className="bg-white rounded-2xl shadow-xl p-12 gap-14 lg:col-span-5 lg:sticky lg:top-10">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                    
                                </h2>
                            </div>
                        </div>
                    </div>
                )}
            </main>

        </div>
    )
}

export default TourismManagersPage;