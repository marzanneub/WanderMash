"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

const LoginForm: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submission, setSubmission] = useState(false);

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

        setSubmission(true);

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

        if (Object.keys(newErrors).length !== 0) {
            setSubmission(false)
            return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/auth/login`, {
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

            setSubmission(false);

            return;
        }
        
        router.push("/?message=Login Successful");
    };
    
    return (
        <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-8">
            <h2 className="text-3xl font-extrabold text-indigo-900 mb-8 text-center">Welcome Back</h2>
            
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
                <Link href="/forgot-password" className="text-indigo-600 hover:text-indigo-800 font-medium">Forgot password?</Link>
                </div>
            </div>
            <button
                type="submit"
                className="w-full bg-indigo-600 flex items-center justify-center text-white font-semibold py-3 rounded-md disabled:opacity-70"
                disabled={submission}
            >
                {submission ? (
                <>
                    {/* This is a pure Tailwind Spinner */}
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                </>
                ) : (
                    "Log In"
                )}
            </button>
            </form>

            {/* <!-- Registration link --> */}
            <p className="text-center text-sm text-gray-600 mt-6">
                Don&apos;t have an account?
            <Link href="/registration" className="text-indigo-600 hover:text-indigo-800 font-medium"> Register here </Link>
            </p>
        </div>
    )
}

export default LoginForm;