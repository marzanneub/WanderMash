"use client";
import React, {useState, useEffect} from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import SidebarTourismManager from "@/components/navigation/sidebarTourismManager";
import InfoGrid from "@/components/data-display/info-grid";
import InfoGridSkeleton from "@/components/data-display/info-grid-skeleton";

interface User {
    name: string;
    profilePicture: string;
    email: string;
    phone: string;
    district: string;
    address: string;
    approved: boolean;
}

const TourismManagerProfilePage: React.FC = () => {
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

/////////////////////////////////////////////
    const contactInformation = [
        { label: "Email", value: user?.email },
        { label: "Phone Number", value: user?.phone },
        { label: "Approved", value: user?.approved },
    ];

    const location = [
        { label: "Address", value: user?.address },
        { label: "District", value: user?.district },
    ];
/////////////////////////////////////////////

    return (
        <div className="bg-indigo-50 min-h-screen w-full flex">
            <SidebarTourismManager  pagetype="Profile"/>

            <main className="container mx-auto px-10 py-16 max-w-7xl">
                <h1 className="text-4xl font-bold text-indigo-900 mb-10">Profile</h1>

                {loading && (
                    <div className="bg-white rounded-2xl shadow-xl p-12 flex flex-col md:flex-row gap-14">
                        <div className="md:w-1/4 flex flex-col items-center border-gray-200 pr-6">
                            <div className="rounded-full w-36 h-36 bg-gray-200 mb-6"></div>
                            <div className="h-6 w-32 bg-gray-300 rounded mb-2"></div>
                            <div className="h-4 w-40 bg-gray-200 rounded mb-6"></div>
                        </div>

                        <div className="md:w-2/3 space-y-12 ">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <InfoGridSkeleton />
                                <InfoGridSkeleton />
                            </div>
                        </div>
                    </div>
                )}


                {/* {!loading && user && ( */}
                {user!==null && (
                <div className="bg-white rounded-2xl shadow-xl p-12 flex flex-col md:flex-row gap-14">
                    <div className="md:w-1/4 flex flex-col items-center border-gray-300 pr-10 md:sticky md:top-[128px] md:h-[calc(100vh-128px)] md:z-40">
                        <img
                            src={`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/images/${user.profilePicture}`}
                            className="w-48 h-48 object-cover rounded-full mb-8 shadow-lg"
                        />
                        <h2 className="text-2xl font-semibold text-indigo-900 mb-2">{user.name} </h2>
                    </div>

                    {/* section className="md:w-2/3 space-y-12 text-indigo-900" */}
                    <div className="md:w-2/3 space-y-12 ">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* <InfoGrid title="Contact Information" items={contactInformation} /> */}
                            <InfoGrid title="Contact Information" items={contactInformation} />
                            <InfoGrid title="Location" items={location} />
                        </div>
                    </div>

                </div>
                )}

            </main>

        </div>
    )
}

export default TourismManagerProfilePage;