"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import SidebarAdmin from "@/components/navigation/sidebarAdmin";
import { districtAreas } from "@/data/locations/districtAreas";

interface Restaurants {
    _id: string;
    name: string;
    email: string;
    phone: string;
    district: string;
    verified: boolean;
    approved: boolean;
    dp: string;
}

const AdminRestaurantsPage: React.FC = () => {
    const [restaurants, setRestaurants] = useState<Restaurants[]>([]);
    const [loading, setLoading] = useState(true);

    const districts = Object.keys(districtAreas);

    const searchParams = useSearchParams();
    const warnmessage = searchParams.get("warnmessage");
    const successmessage = searchParams.get("successmessage");
    const errormessage = searchParams.get("errormessage");
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
        fetch('/api/admin-get-restaurants')
            .then(res => res.json())
            .then(data => {
                setRestaurants(data.restaurants);
                setLoading(false);
            }
        );
    }, []);

    const handleApprove = async (_id: string) => {
        const formData = new FormData();
        formData.append("_id", _id);
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/admin/approveRestaurant`, {
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

            fetch('/api/admin-get-restaurants')
                .then(res => res.json())
                .then(data => {
                    setRestaurants(data.restaurants);
                }
            );

            return;
        }
    }
    
    const handleDisapprove = async (_id: string) => {
        const formData = new FormData();
        formData.append("_id", _id);
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/admin/disapproveRestaurant`, {
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

            fetch('/api/admin-get-restaurants')
                .then(res => res.json())
                .then(data => {
                    setRestaurants(data.restaurants);
                }
            );

            return;
        }
    }

    return (
        <div className="bg-indigo-50 min-h-screen w-full flex">
            <SidebarAdmin pagetype="Users" />

            <main className="container mx-auto px-10 py-16 max-w-7xl">
                <h1 className="text-4xl font-bold text-indigo-900 mb-10">Restaurants</h1>

                {loading && (
                <div className="grid grid-cols-1 gap-10 items-start animate-pulse">

                    {/* RIGHT LIVE MENU VIEW */}
                    <div className="space-y-5">
                    
                    {/* Title */}
                    <div className="h-6 w-48 bg-gray-200 rounded" />

                    {/* Menu Item Skeletons */}
                    {[...Array(3)].map((_, i) => (
                        <div
                        key={i}
                        className="bg-white p-5 rounded-2xl border border-slate-200 flex gap-5 shadow-sm"
                        >
                        {/* Image */}
                        <div className="w-24 h-24 bg-gray-200 rounded-2xl shrink-0" />

                        {/* Content */}
                        <div className="flex-1 space-y-3">
                            <div className="flex justify-between">
                            <div>
                                <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
                                <div className="h-5 w-40 bg-gray-200 rounded" />
                            </div>
                            <div className="h-5 w-16 bg-gray-200 rounded" />
                            </div>

                            <div className="space-y-2">
                            <div className="h-4 w-16 bg-gray-200 rounded" />
                            </div>

                            <div className="flex gap-4 mt-4 pt-3 border-t border-slate-100">
                            <div className="h-4 w-16 bg-gray-200 rounded" />
                            </div>
                        </div>
                        </div>
                    ))}
                    </div>

                </div>

                )}

                {!loading && (
                    <div className="grid grid-cols-1 gap-10 items-start">


                        <div className="space-y-5">
                            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                All Restaurants ({restaurants?.length})
                            </h2>
                            {(restaurants && restaurants.length>0) ? (restaurants.map((item, index) => (
                                <div key={index} className="bg-white p-5 rounded-2xl border flex gap-5 shadow-sm transition-all border-slate-200">
                                    <img src={`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/images/${item.dp}`} className="w-24 h-24 rounded-2xl object-cover border border-slate-100 shrink-0" />

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className={`text-[10px] ${item.approved ? "bg-indigo-50 text-indigo-600" : "bg-red-50 text-red-600"} px-2 py-0.5 rounded-full font-bold uppercase tracking-wider`}>
                                                    {item.approved ? "Approved" : "Disapproved"}
                                                </span>
                                                <h4 className="text-xl font-bold text-slate-800 mt-1">{item.name}</h4>
                                            </div>
                                            <p className="text-indigo-600 font-black text-lg">{item.district}</p>
                                        </div>
                                        <p className="text-slate-500 text-sm mt-2 line-clamp-2 leading-relaxed">
                                            {item.phone}
                                        </p>
                                        <div className="flex gap-4 mt-4 pt-3 border-t border-slate-50">
                                            {item.approved && (
                                            <button onClick={() => handleDisapprove(item._id)} className="text-red-400 hover:text-amber-500 flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer">
                                                Disapprove
                                            </button>)}
                                            {!item.approved && (
                                            <button onClick={() => handleApprove(item._id)} className="text-green-400 hover:text-amber-500 flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer">
                                                Approve
                                            </button>)}
                                            <Link
                                            href={`/restaurants/preview?id=${item._id}`}
                                            className="text-slate-400 hover:text-amber-500 flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer">
                                                Preview
                                            </Link>
                                        </div>
                                    </div>
                                    
                                </div>
                                ))
                            ) : (
                            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center">
                                <h3 className="text-xl font-bold text-slate-700">No restaurants found</h3>
                            </div>
                            )}
                        </div>


                    </div>
                )}
            </main>

        </div>
    )
}

export default AdminRestaurantsPage;