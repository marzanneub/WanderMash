"use client";
import React, {useState, useEffect} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import SidebarAdmin from "@/components/navigation/sidebarAdmin";

interface User {
    email: string;
    profilePicture: string;
}

const AdminSettingsPage: React.FC = () => {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const newErrors: typeof errors = {};
    
        if(password.length || newPassword.length || confirmPassword.length) {
            if(password === "") {
                newErrors.password = "Password is required";
            }
            if(password && password.length < 8) {
                    newErrors.password = "Password must be at least 8 characters";
            }
            if(newPassword === "") {
                    newErrors.newPassword = "New password is required";
            }
            if(newPassword && newPassword.length < 8) {
                    newErrors.newPassword = "New password must be at least 8 characters";
            }
            if(newPassword !== confirmPassword) newErrors.confirmPassword = "Password doesn't matched";
    
            setErrors(newErrors);
            if (Object.keys(newErrors).length !== 0) return;
    
            const res = await fetch("http://localhost:4000/admin/settings", {
                method: "POST",
                headers: {
                        "Content-Type": "application/json",
                },
                body: JSON.stringify({ password, newPassword, confirmPassword }),
                credentials: "include",
            });
    
            const data = await res.json();
            if(!res.ok){
                // newErrors.message = data.message;
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
                
            router.push("dashboard?successmessage=Successfully settings updated");
            return;
        }
            
        router.push("dashboard?warnmessage=Nothing changed");
    }


    return (
        <div className="bg-indigo-50 min-h-screen w-full flex">
            <SidebarAdmin pagetype="Settings" />

            <main className="container mx-auto px-10 py-16 max-w-7xl">
                <h1 className="text-4xl font-bold text-indigo-900 mb-10">Settings</h1>
                
                {loading && (
                    <div className="bg-white rounded-xl shadow-lg p-8 space-y-8 animate-pulse">
                        {/* Fieldset */}
                        <fieldset className="border border-gray-300 rounded-md p-6 space-y-6">
                            {/* Legend */}
                            <div className="h-6 w-48 bg-gray-300 rounded" />

                            {/* Current Password */}
                            <div className="space-y-2">
                            <div className="h-4 w-40 bg-gray-200 rounded" />
                            <div className="h-12 w-full bg-gray-200 rounded-md" />
                            </div>

                            {/* New Password */}
                            <div className="space-y-2">
                            <div className="h-4 w-36 bg-gray-200 rounded" />
                            <div className="h-12 w-full bg-gray-200 rounded-md" />
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                            <div className="h-4 w-48 bg-gray-200 rounded" />
                            <div className="h-12 w-full bg-gray-200 rounded-md" />
                            </div>
                        </fieldset>

                        {/* Buttons */}
                        <div className="flex justify-between items-center">
                            <div className="h-12 w-28 bg-gray-200 rounded-md" />
                            <div className="h-12 w-36 bg-gray-300 rounded-md" />
                        </div>
                    </div>

                )}
                {user!==null && (
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
                            <fieldset className="border border-gray-300 rounded-md p-6">
                                <legend className="text-xl font-semibold text-indigo-900 mb-4">Change Password</legend>
                                <div className="mb-4">
                                    <label htmlFor="password"  className="block text-sm font-medium text-gray-700 mb-1">Current Password <span className="text-red-500">*</span></label>
                                    <input 
                                    type="password"
                                    id="password" 
                                    name="password"
                                    placeholder="Enter current password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="newPassword"  className="block text-sm font-medium text-gray-700 mb-1">New Password <span className="text-red-500">*</span></label>
                                    <input
                                    type="password" 
                                    id="newPassword" 
                                    name="newPassword" 
                                    placeholder="Enter new password"
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.newPassword && (
                                        <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password <span className="text-red-500">*</span></label>
                                    <input
                                    type="password" 
                                    id="confirmPassword" 
                                    name="confirmPassword"
                                    placeholder="Confirm new password"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                    )}
                                </div>
                            </fieldset>
                            <div className="flex justify-between items-center">
                                <Link href={`profile?warnmessage=${"Nothing Changed"}`}>
                                <button className="px-4 py-3 text-indigo-600 hover:bg-gray-100 font-semibold rounded-md shadow-md transition cursor-pointer">
                                    Cancel
                                </button>
                                </Link>

                                <button type="submit"
                                    className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold border rounded-md shadow-md transition cursor-pointer">
                                    Save Settings
                                </button>
                            </div>
                        </div>
                    </form>
                )}

            </main>
        </div>
    )

}

export default AdminSettingsPage;