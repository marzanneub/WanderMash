"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

const LoginForm: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const searchParams = useSearchParams();
    const message  = searchParams.get("message");
    useEffect(() => {
        toast.success(message, {
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

    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
        errormessage?: string;
    }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: typeof errors = {};

        if (!email) {
            newErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length !== 0) return;

        const res = await fetch("http://localhost:4000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            credentials: "include",
        });

        const data = await res.json();
        if(!res.ok && data.errormessage ==="Not verified"){
            // newErrors.message = data.message;
            const msg = "Enter your verification code";
            router.push(`/verification?message=${msg}`);
            return;
        }
        else if(!res.ok){
            // newErrors.message = data.message;
            const msg = "Invalid email or Password";
            setErrors({ errormessage: data.errormessage });
            toast.error(errors.errormessage || msg, {
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
        
        router.push("/?message=Login Successful");
    };
    
    return (
        <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-8">
            <h2 className="text-3xl font-extrabold text-indigo-900 mb-8 text-center">Welcome Back</h2>
            
            {/* <form action="/login" method="POST" className="space-y-6"></form> */}
            <form onSubmit={handleSubmit} className="space-y-6">
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
            <div className="flex justify-between items-center">
                <div className="text-sm">
                <a href="/forgot-password" className="text-indigo-600 hover:text-indigo-800 font-medium">Forgot password?</a>
                </div>
            </div>
            <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md shadow-md transition cursor-pointer"
            >
                Log In
            </button>
            </form>

            {/* <!-- Registration link --> */}
            <p className="text-center text-sm text-gray-600 mt-6">
                Don&apos;t have an account?
            <a href="/registration" className="text-indigo-600 hover:text-indigo-800 font-medium"> Register here </a>
            </p>
        </div>
    )
}

export default LoginForm;