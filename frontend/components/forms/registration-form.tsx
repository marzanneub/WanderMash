"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { districtUpazilas } from "@/data/locations/districtUpazilas";

const RegistrationForm: React.FC = () => {
    const router = useRouter();
    const [role, setRole] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [registrationId, setRegistrationId] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [district, setDistrict] = useState("")
    const [upazila, setUpazila] = useState("")
    const [address, setAddress] = useState("")

    const districts = Object.keys(districtUpazilas);



    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        phone?: string;
        registrationId?: string;
        password?: string;
        confirmPassword?: string;
        district?: string;
        upazila?: string;
        address?: string;
        errormessage?: string;
    }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: typeof errors = {};

        if(role === "generalUser") {
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
            } else if(phone.startsWith("880")) {
                setPhone(`+${phone}`);
            } else if(phone.startsWith("0")) {
                setPhone(`+880${phone.slice(1)}`);
            } else if(!phone.startsWith("+880")) {
                setPhone(`+880${phone}`);
            }

            if(!password) {
                newErrors.password = "Password is required";
            }
            if(password && password.length < 8) {
                newErrors.password = "Password must be at least 8 characters";
            }
            if(password !== confirmPassword) newErrors.confirmPassword = "Password doesn't matched";

            setErrors(newErrors);
            // console.log(phone);

            if (Object.keys(newErrors).length !== 0) return;

            const res = await fetch("http://localhost:4000/auth/registration", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, phone, password, role }),
                credentials: "include",
            });

            const data = await res.json();
            if(!res.ok){
                setErrors({ errormessage: data.errormessage });

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
            router.push(`/verification?message=${data.successmessage}`);
        }
        else if(role === "restaurant") {
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
            } else if(phone.startsWith("880")) {
                setPhone(`+${phone}`);
            } else if(phone.startsWith("0")) {
                setPhone(`+880${phone.slice(1)}`);
            } else if(!phone.startsWith("+880")) {
                setPhone(`+880${phone}`);
            }

            if(!registrationId) {
                newErrors.registrationId = "Registration ID is required";
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

            if(!password) {
                newErrors.password = "Password is required";
            }
            if(password && password.length < 8) {
                newErrors.password = "Password must be at least 8 characters";
            }
            if(password !== confirmPassword) newErrors.confirmPassword = "Password doesn't matched";

            setErrors(newErrors);
            // console.log(phone);

            if (Object.keys(newErrors).length !== 0) return;

            const res = await fetch("http://localhost:4000/auth/registration", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ role, name, email, phone, registrationId, district, upazila, address, password }),
                credentials: "include",
            });

            const data = await res.json();
            if(!res.ok){
                setErrors({ errormessage: data.errormessage });

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
            router.push(`/verification?message=${data.successmessage}`);
        }
    };
    
    return (
        <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-8">
            <h2 className="text-3xl font-extrabold text-indigo-900 mb-8 text-center">Registration</h2>
            
            {/* <form action="/login" method="POST" className="space-y-6"></form> */}
            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Select User Type <span className="text-red-500">*</span></label>
                <select
                id="role"
                name="role"
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="" disabled selected>-- select user type --</option>
                    <option value="generalUser">General User</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="hotel">Hotel</option>
                </select>
            </div>
            {role==="generalUser" &&(
                <div className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                        <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Your Name"
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
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                        <input
                        id="password"
                        name="password"
                        type="password"
                        // required
                        placeholder="••••••••"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password <span className="text-red-500">*</span></label>
                        <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        // required
                        placeholder="••••••••"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                        )}
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md shadow-md transition cursor-pointer"
                    >
                        Register
                    </button>
                </div>
                
            )}
            {role==="restaurant" &&(
                <div className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name <span className="text-red-500">*</span></label>
                        <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Your Name"
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
                        <label htmlFor="registrationId" className="block text-sm font-medium text-gray-700 mb-1">Registration ID <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="registrationId"
                            name="registrationId"
                            placeholder="XXXXXXXXX"
                            // required
                            onChange={(e) => setRegistrationId(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.registrationId && (
                            <p className="mt-1 text-sm text-red-600">{errors.registrationId}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">Select District <span className="text-red-500">*</span></label>
                        <select
                        id="district"
                        name="district"
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
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            placeholder="Street, City, Country"
                            // required
                            onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.address && (
                            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                        <input
                        id="password"
                        name="password"
                        type="password"
                        // required
                        placeholder="••••••••"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password <span className="text-red-500">*</span></label>
                        <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        // required
                        placeholder="••••••••"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                        )}
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md shadow-md transition cursor-pointer"
                    >
                        Register
                    </button>
                </div>
                
            )}
            
            </form>

            {/* <!-- Registration link --> */}
            <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?
            <a href="/login" className="text-indigo-600 hover:text-indigo-800 font-medium"> Log in here </a>
            </p>
        </div>
    )
}

export default RegistrationForm;