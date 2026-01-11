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

const GeneralUserProfilePage: React.FC = () => {
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
            <SidebarGeneralUser pagetype="Profile" />

            <main className="container mx-auto px-10 py-16 max-w-7xl">
                <h1 className="text-4xl font-bold text-indigo-900 mb-10">Your Profile</h1>
                
                {loading && (
                    <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row gap-10 animate-pulse">

                        <div className="md:w-1/4 flex flex-col items-center border-gray-200 pr-6">
                            <div className="rounded-full w-36 h-36 bg-gray-200 mb-6"></div>
                            <div className="h-6 w-32 bg-gray-300 rounded mb-2"></div>
                            <div className="h-4 w-40 bg-gray-200 rounded mb-6"></div>
                        </div>
                        <section className="md:w-3/4 space-y-10">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="bg-gray-100 p-4 rounded-lg h-20"></div>
                                <div className="bg-gray-100 p-4 rounded-lg h-20"></div>
                                <div className="bg-gray-100 p-4 rounded-lg h-20"></div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-gray-100 p-6 rounded-lg h-20"></div>
                                <div className="bg-gray-100 p-6 rounded-lg h-20"></div>
                                <div className="bg-gray-100 p-6 rounded-lg h-20"></div>
                                <div className="bg-gray-100 p-6 rounded-lg h-20"></div>
                            </div>
                        </section>
                    </div>

                )}
                
                {user!==null && (
                <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row gap-10">
                    <div className="md:w-1/4 flex flex-col items-center border-gray-200 pr-6">
                        <img
                            src={`http://localhost:4000/images/${user.profilePicture}`}
                            className="rounded-full w-36 h-36 object-cover mb-6 shadow-md"
                        />
                        <h2 className="text-2xl font-semibold text-indigo-900 mb-1">{user.name}</h2>
                        <p className="text-gray-600 mb-6">{user.email}</p>
                    </div>

                    <section className="md:w-3/4 space-y-10">

                        <div className="grid grid-cols-3 gap-4 text-center text-gray-700">
                            <div className="bg-indigo-50 p-4 rounded-lg shadow-sm">
                                <p className="text-2xl font-bold">12</p>
                                <p className="text-sm">Trips</p>
                            </div>
                            <div className="bg-indigo-50 p-4 rounded-lg shadow-sm">
                                <p className="text-2xl font-bold">5</p>
                                <p className="text-sm">Reviews</p>
                            </div>
                            <div className="bg-indigo-50 p-4 rounded-lg shadow-sm">
                                <p className="text-2xl font-bold">8</p>
                                <p className="text-sm">Wishlisted</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-indigo-50 p-6 rounded-lg shadow-sm">
                                <h3 className="text-sm font-medium text-indigo-700">Full Name</h3>
                                <p className="text-lg text-gray-800 font-semibold">{user.name}</p>
                            </div>
                            <div className="bg-indigo-50 p-6 rounded-lg shadow-sm">
                                <h3 className="text-sm font-medium text-indigo-700">Email</h3>
                                <p className="text-lg text-gray-800 font-semibold">{user.email}</p>
                            </div>
                            <div className="bg-indigo-50 p-6 rounded-lg shadow-sm">
                                <h3 className="text-sm font-medium text-indigo-700">Phone Number</h3>
                                <p className="text-lg text-gray-800 font-semibold">{user.phone}</p>
                            </div>
                            <div className="bg-indigo-50 p-6 rounded-lg shadow-sm">
                                <h3 className="text-sm font-medium text-indigo-700">Bio</h3>
                                <p className="text-lg text-gray-800 font-semibold">{user.bio}</p>
                            </div>
                        </div>
                            
                    </section>


                </div>)}
            </main>

        </div>
    )
}

export default GeneralUserProfilePage;