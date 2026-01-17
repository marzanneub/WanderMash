"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const ForgotPasswordForm: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [submission, setSubmission] = useState(false);

    const [errors, setErrors] = useState<{
        email?: string;
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

        setErrors(newErrors);

        if (Object.keys(newErrors).length !== 0) {
            setSubmission(false)
            return;
        }

        const res = await fetch("http://localhost:4000/auth/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
            credentials: "include",
        });

        if(!res.ok){
            const data = await res.json();
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
        
        router.push("/password-recovery?message=A new password reset code has been sent to your email address. Please check your inbox to proceed.");
    };
    
    return (
        <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-8">
            <h2 className="text-3xl font-extrabold text-indigo-900 mb-6 text-center">Forgot Your Password?</h2>

            <p className="text-gray-600 text-center mb-6">
                Enter your valid email address and we’ll send you a link to reset your password.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
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
                    "Send Reset Code"
                )}
            </button>
            </form>

            <div className="mt-6 text-center text-sm">
                <a href="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">Back to Login</a>
            </div>
        </div>
    )
}

export default ForgotPasswordForm;