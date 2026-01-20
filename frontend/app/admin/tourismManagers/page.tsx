"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import SidebarAdmin from "@/components/navigation/sidebarAdmin";
import { districtUpazilas } from "@/data/locations/districtUpazilas";

interface TourismManager {
    _id: string;
    name: string;
    email: string;
    phone: string;
    district: string;
    verified: boolean;
    approved: boolean;
    profilePicture: string;
}

const TourismManagersPage: React.FC = () => {
    const [tourismManagers, setTourismManagers] = useState<TourismManager[]>([]);
    const [loading, setLoading] = useState(true);

    const districts = Object.keys(districtUpazilas);

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
        fetch('/api/admin-get-tourismManagers')
            .then(res => res.json())
            .then(data => {
                setTourismManagers(data.tourismManagers);
                setLoading(false);
            }
        );
    }, []);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [district, setDistrict] = useState("");

    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        phone?: string;
        district?: string;
    }>({});

    const resetForm = async() => {
        setName("");
        setEmail("");
        setPhone("");
        setDistrict("");
    }

    const handleApprove = async (_id: string) => {
        const formData = new FormData();
        formData.append("_id", _id);
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/admin/approveTourismManager`, {
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

            fetch('/api/admin-get-tourismManagers')
                .then(res => res.json())
                .then(data => {
                    setTourismManagers(data.tourismManagers);
                }
            );

            return;
        }
    }
    
    const handleDisapprove = async (_id: string) => {
        const formData = new FormData();
        formData.append("_id", _id);
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/admin/disapproveTourismManager`, {
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

            fetch('/api/admin-get-tourismManagers')
                .then(res => res.json())
                .then(data => {
                    setTourismManagers(data.tourismManagers);
                }
            );

            return;
        }
    }
    
    //////////////////For adding mamager///////////////

    const handleAddTourismManager = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: typeof errors = {};

        if(!name) {
            newErrors.name = "Name is required";
        }

        if(!email) {
            newErrors.email = "Email is required";
        } else if(!/^\S+@\S+\.\S+$/.test(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if(!phone) {
            newErrors.phone = "Phone number is required";
        }

        if(!district) {
            newErrors.district = "District is required";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length !== 0) return;

        const formData = new FormData();

        formData.append("name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("district", district);

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/admin/addTourismManager`, {
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

            fetch('/api/admin-get-tourismManagers')
                .then(res => res.json())
                .then(data => {
                    setTourismManagers(data.tourismManagers);
                }
            );
            resetForm();

            return;
        }

    }



    /////////////////////////////////////////////////

    return (
        <div className="bg-indigo-50 min-h-screen w-full flex">
            <SidebarAdmin pagetype="Users" />

            <main className="container mx-auto px-10 py-16 max-w-7xl">
                <h1 className="text-4xl font-bold text-indigo-900 mb-10">Tourism Managers</h1>

                {loading && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start animate-pulse">
                    
                    {/* LEFT FORM SKELETON */}
                    <div className="bg-white rounded-2xl shadow-xl p-12 gap-14 lg:col-span-5 lg:sticky lg:top-10 space-y-6">
                    
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="h-6 w-40 bg-gray-200 rounded" />
                    </div>

                    {/* Input Fields */}
                    <div className="space-y-4">
                        <div>
                        <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                        <div className="h-12 w-full bg-gray-200 rounded-md" />
                        </div>

                        <div>
                        <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                        <div className="h-12 w-full bg-gray-200 rounded-md" />
                        </div>

                        <div>
                        <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                        <div className="h-12 w-full bg-gray-200 rounded-md" />
                        </div>

                        <div>
                        <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                        <div className="h-12 w-full bg-gray-200 rounded-md" />
                        </div>

                        {/* Submit Button */}
                        <div className="h-12 w-full bg-gray-300 rounded-md mt-4" />
                    </div>
                    </div>

                    {/* RIGHT LIVE MENU VIEW */}
                    <div className="lg:col-span-7 space-y-5">
                    
                    {/* Title */}
                    <div className="h-6 w-48 bg-gray-200 rounded" />

                    {/* Menu Item Skeletons */}
                    {[...Array(3)].map((_, i) => (
                        <div
                        key={i}
                        className="bg-white p-5 rounded-2xl border border-slate-200 flex gap-5 shadow-sm"
                        >
                        {/* Image */}
                        <div className="w-24 h-24 bg-gray-200 rounded-full shrink-0" />

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
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                        <div className="bg-white rounded-2xl shadow-xl p-12 gap-14 lg:col-span-5 lg:sticky lg:top-10">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                    Add Manager
                                </h2>
                            </div>

                            <form  onSubmit={handleAddTourismManager} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Manager name <span className="text-red-500">*</span></label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        // required
                                        placeholder="Manager Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address <span className="text-red-500">*</span></label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        // required
                                        placeholder="manager@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        id="phone"
                                        name="phone"
                                        placeholder="01XXX XXX XXX"
                                        // required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">Select District <span className="text-red-500">*</span></label>
                                    <select
                                        id="district"
                                        name="district"
                                        value={district}
                                        onChange={(e) => setDistrict(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="" disabled selected>-- select district --</option>
                                        {districts.map((d) => (
                                            <option key={d} value={d}>
                                                {d}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.district && (
                                        <p className="mt-1 text-sm text-red-600">{errors.district}</p>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md shadow-md transition cursor-pointer`}
                                >
                                    Add Manager
                                </button>
                            </form>
                        </div>




                        <div className="lg:col-span-7 space-y-5">
                            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                All Managers
                            </h2>
                            {(tourismManagers && tourismManagers.length>0) ? (tourismManagers.map((manager, index) => (
                                <div key={index} className="bg-white p-5 rounded-2xl border flex gap-5 shadow-sm transition-all border-slate-200">
                                    <img src={`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/images/${manager.profilePicture}`} className="w-24 h-24 rounded-full object-cover border border-slate-100 shrink-0" />

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className={`text-[10px] ${manager.approved ? "bg-indigo-50 text-indigo-600" : "bg-red-50 text-red-600"} px-2 py-0.5 rounded-full font-bold uppercase tracking-wider`}>
                                                    {manager.approved ? "Approved" : "Disapproved"}
                                                </span>
                                                <h4 className="text-xl font-bold text-slate-800 mt-1">{manager.name}</h4>
                                            </div>
                                            <p className="text-indigo-600 font-black text-lg">{manager.district}</p>
                                        </div>
                                        <p className="text-slate-500 text-sm mt-2 line-clamp-2 leading-relaxed">
                                            {manager.phone}
                                        </p>
                                        <div className="flex gap-4 mt-4 pt-3 border-t border-slate-50">
                                            {manager.approved && (
                                            <button onClick={() => handleDisapprove(manager._id)} className="text-red-400 hover:text-amber-500 flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer">
                                                Disapprove
                                            </button>)}
                                            {!manager.approved && (
                                            <button onClick={() => handleApprove(manager._id)} className="text-green-400 hover:text-amber-500 flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer">
                                                Approve
                                            </button>)}
                                        </div>
                                    </div>
                                    
                                </div>
                                ))
                            ) : (
                            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center">
                                <h3 className="text-xl font-bold text-slate-700">No managers found</h3>
                                <p className="text-slate-500 mt-2 max-w-xs mx-auto text-sm">
                                The staff directory is currently empty. Use the registration form to add your first tourism manager.
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

export default TourismManagersPage;