"use client";
import React, {useState, useEffect} from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import SidebarTourismManager from "@/components/navigation/sidebarTourismManager";
import { districtUpazilas } from "@/data/locations/districtUpazilas";
import { attractionFacilities } from "@/data/attractions";

interface Attraction {
    _id: string;
    name: string;
    email: string;
    phone: string;
    dp: string;
    category: string;
    description: string;
    district: string;
    upazila: string;
    address: string;
    approved: boolean;
}

const TourismManagerAttractionsPage: React.FC = () => {
    const [attractions, setAttractions] = useState<Attraction[]>([]);

    const [loading, setLoading] = useState(true);

    const districts = Object.keys(districtUpazilas);
    const categories = Object.keys(attractionFacilities);

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
        fetch('/api/tourismManager-get-my-added-attractions') 
            .then(res => res.json())
            .then(data => {
                setAttractions(data.attractions);
                setLoading(false);
            }
        );
    }, []);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [category, setCategory] = useState("");
    const [district, setDistrict] = useState("");
    const [upazila, setUpazila] = useState("");
    const [address, setAddress] = useState("");

    
    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        phone?: string;
        category?: string;
        district?: string;
        upazila?: string;
        address?: string;
    }>({});
    
    const resetForm = async() => {
        setName("");
        setEmail("");
        setPhone("");
        setCategory("");
        setDistrict("");
        setUpazila("");
        setAddress("");
    }

    const handleDeleteAttraction = async (_id: string) => {
        const formData = new FormData();
        formData.append("id", _id);
        
        const res = await fetch("http://localhost:4000/tourismManager/deleteAttraction", {
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

            fetch('/api/tourismManager-get-my-added-attractions') 
                .then(res => res.json())
                .then(data => {
                    setAttractions(data.attractions);
                }
            );

            return;
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: typeof errors = {};

        if(!name) {
            newErrors.name = "Name is required";
        }

        if(!phone) {
            newErrors.phone = "Phone number is required";
        }

        if(!email) {
            newErrors.email = "Email is required";
        } else if(!/^\S+@\S+\.\S+$/.test(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if(!category) {
            newErrors.category = "category is required";
        }

        if(!district) {
            newErrors.district = "District is required";
        }

        if(!upazila) {
            newErrors.upazila = "Upazila is required";
        }

        if(!address) {
            newErrors.address = "Address is required";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length !== 0) return;



        const formData = new FormData();

        formData.append("name", name);
        formData.append("phone", phone);
        formData.append("email", email);
        formData.append("category", category);
        formData.append("district", district);
        formData.append("upazila", upazila);
        formData.append("address", address);

        const res = await fetch("http://localhost:4000/tourismManager/addAttraction", {
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
            resetForm();

            fetch('/api/tourismManager-get-my-added-attractions') 
                .then(res => res.json())
                .then(data => {
                    setAttractions(data.attractions);
                }
            );

            return;
        }

    }

    return (
        <div className="bg-indigo-50 min-h-screen w-full flex">
            <SidebarTourismManager  pagetype="Attractions"/>

            <main className="container mx-auto px-10 py-16 max-w-7xl">
                <h1 className="text-4xl font-bold text-indigo-900 mb-10">Attractions</h1>

                {loading && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start animate-pulse">
                    
                    {/* LEFT FORM SKELETON */}
                    <div className="bg-white rounded-2xl shadow-xl p-12 gap-14 lg:col-span-5 lg:sticky lg:top-10 space-y-6">
                    
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="h-6 w-40 bg-gray-200 rounded" />
                    </div>

                    <div className="space-y-4">
                        <div>
                        <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                        <div className="h-12 w-full bg-gray-200 rounded-md" />
                        </div>

                        <div>
                        <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                        <div className="h-12 w-full bg-gray-200 rounded-md" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="h-4 w-16 bg-gray-200 rounded mb-2" />
                            <div className="h-12 bg-gray-200 rounded-md" />
                        </div>
                        <div>
                            <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
                            <div className="h-12 bg-gray-200 rounded-md" />
                        </div>
                        </div>

                        <div>
                        <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                        <div className="h-12 w-full bg-gray-200 rounded-md" />
                        </div>

                        <div>
                        <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                        <div className="h-12 w-full bg-gray-200 rounded-md" />
                        </div>

                        <div>
                        <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                        <div className="h-12 w-full bg-gray-200 rounded-md" />
                        </div>

                        <div className="h-12 w-full bg-gray-300 rounded-md mt-4" />
                    </div>
                    </div>

                    <div className="lg:col-span-7 space-y-5">
                    
                    <div className="h-6 w-48 bg-gray-200 rounded" />

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
                            </div>

                            <div className="space-y-2">
                            <div className="h-4 w-full bg-gray-200 rounded" />
                            <div className="h-4 w-5/6 bg-gray-200 rounded" />
                            </div>

                            <div className="flex gap-4 mt-4 pt-3 border-t border-slate-100">
                            <div className="h-4 w-16 bg-gray-200 rounded" />
                            <div className="h-4 w-16 bg-gray-200 rounded" />
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
                            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">Add Attraction</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Attraction name <span className="text-red-500">*</span></label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    // required
                                    placeholder="e.g. Saint Martin"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                                <select
                                    value={category} 
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full h-12 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="" disabled selected>-- select category --</option>
                                        {categories.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                </select>
                                {errors.category && (
                                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">Select District <span className="text-red-500">*</span></label>
                                    <select
                                    id="district"
                                    name="district"
                                    value={district}
                                    onChange={(e) => {
                                        setDistrict(e.target.value);
                                        setUpazila("");
                                    }}
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
                                <div>
                                    <label htmlFor="upazila" className="block text-sm font-medium text-gray-700 mb-1">Select Upazila <span className="text-red-500">*</span></label>
                                    <select
                                    id="upazila"
                                    name="upazila"
                                    value={upazila}
                                    onChange={(e) => setUpazila(e.target.value)}
                                    disabled={!district}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">
                                            {district ? "-- select upazila --" : "-- select district first --"}
                                        </option>

                                        {district &&
                                            districtUpazilas[district]?.map((u) => (
                                            <option key={u} value={u}>
                                                {u}
                                            </option>
                                        ))}

                                    </select>
                                    {errors.upazila && (
                                        <p className="mt-1 text-sm text-red-600">{errors.upazila}</p>
                                    )}
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address  <span className="text-red-500">*</span></label>
                                <input
                                id="email"
                                name="email"
                                value={email}
                                type="email"
                                // required
                                placeholder="you@example.com"
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
                                    value={phone}
                                    placeholder="01XXX XXX XXX"
                                    // required
                                    onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.phone && (
                                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={address}
                                    placeholder="Street, City, Country"
                                    // required
                                    onChange={(e) => setAddress(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.address && (
                                    <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                                )}
                            </div>
                            <button
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md shadow-md transition cursor-pointer"
                            >
                                Add
                            </button>
                        </form>
                    </div>

                    <div className="lg:col-span-7 space-y-5">
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            Your added attractions
                        </h2>
                        
                        {(attractions && attractions.length>0) ? (attractions.map((item) => (
                        <div key={item._id} className="bg-white p-5 rounded-2xl border flex gap-5 shadow-sm transition-all border-slate-200">
                            <img src={`http://localhost:4000/images/${item.dp}`} className="w-24 h-24 rounded-2xl object-cover border border-slate-100 shrink-0" alt={item.name} />
                        
                            <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <div>
                                <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{item.category}</span>
                                <h4 className="text-xl font-bold text-slate-800 mt-1">{item.name}</h4>
                                </div>
                                {/* <p className="text-indigo-600 font-black text-lg">৳{item.price}</p> */}
                            </div>

                            <p className="text-slate-500 text-sm mt-2 line-clamp-2 leading-relaxed italic">
                                {item.description}
                            </p>

                            <div className="flex gap-4 mt-4 pt-3 border-t border-slate-50">
                                <Link href={`attractions/edit?_id=${item._id}`}>
                                <button className="text-slate-400 hover:text-amber-500 flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer">
                                    Edit
                                </button>
                                </Link>
                                <Link href={`attractions/gallery?_id=${item._id}`}>
                                <button className="text-slate-400 hover:text-lime-500 flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer">
                                    Gallery
                                </button>
                                </Link>
                                <button onClick={() => handleDeleteAttraction(item._id)} className="text-slate-400 hover:text-rose-500 flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer">
                                    Delete
                                </button>
                            </div>

                            </div>
                        </div>
                        ))) : (
                        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                            <h3 className="text-xl font-bold text-slate-700">No attractions added yet</h3>
                            <p className="text-slate-500 mt-2 max-w-xs mx-auto">
                            Start showcasing your destination by adding your first attraction using the form on the left.
                            </p>
                        </div>)}


                    </div>

                </div>
                )}

            </main>

        </div>
    )
}

export default TourismManagerAttractionsPage;