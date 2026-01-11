"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

const PasswordRecoveryForm: React.FC = () => {
    const router = useRouter();
    
    const time = 30;
    const [countdown, setCountdown] = useState(time);
    const [canResend, setCanResend] = useState(false);

    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

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
    
    const [success, setSuccess] = useState<{
        successmessage?: string;
    }>({});

    const [errors, setErrors] = useState<{
        code?: string;
        password?: string;
        confirmPassword?: string;
        errormessage?: string;
    }>({});

    useEffect(() => {
    if (canResend) return;

    const timer = setInterval(() => {
        setCountdown(prev => {
        if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
        }
        return prev - 1;
        });
    }, 1000);

    return () => clearInterval(timer);
    }, [canResend]);

    const handleResend = async () => {
        const res = await fetch("http://localhost:4000/auth/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            // body: JSON.stringify({null}),
            credentials: "include",
        });

        const msg = "A new password reset code has been sent to your email address. Please check your inbox to proceed.";

        if(res.ok){
            const data = await res.json();
            // newErrors.errormessage = data.errormessage;
            setSuccess({ successmessage: data.successmessage });
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

            setCountdown(time);
            setCanResend(false);
            return;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: typeof errors = {};

        if (!code) {
            newErrors.code = "Code is required";
        } else if (code.length !== 6) {
            newErrors.code = "Code must be 6 characters";
        }

        if (!password) {
            newErrors.password = "Password is required";
        }
        if (password && password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }
        if(password !== confirmPassword) newErrors.confirmPassword = "Password doesn't matched";

        setErrors(newErrors);

        if (Object.keys(newErrors).length !== 0) return;

        const res = await fetch("http://localhost:4000/auth/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code, password, confirmPassword }),
            credentials: "include",
        });

        if(!res.ok){
            const data = await res.json();
            // newErrors.message = data.message;
            setErrors({ errormessage: data.errormessage });

            const msg = "Invalid verification code";

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

        router.push("/login?message=Password recovery successful");
    }

    
    return (
        <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-8">
            <h2 className="text-3xl font-extrabold text-indigo-900 mb-6 text-center">Reset Your Password</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">Reset Code</label>
                    <input
                    id="code"
                    name="code"
                    type="text"
                    placeholder="e.g., 325471"
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.code && (
                        <p className="mt-1 text-sm text-red-600">{errors.code}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter new password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Re-enter new password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                </div>

                <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md shadow-md transition"
                >
                    Update Password
                </button>
            </form>
            
            <div className="mt-6 text-center text-sm text-gray-600">
                Didn&apos;t receive the code?
                <button
                disabled={!canResend}
                onClick={handleResend}
                className={`font-medium ml-1 ${
                    canResend
                    ? "text-indigo-600 hover:text-indigo-800"
                    : "text-indigo-400 cursor-not-allowed"
                }`}
                >
                {canResend ? "Resend" : `Resend (${countdown}s)`}
                </button>
            </div>
        </div>
    )
}

export default PasswordRecoveryForm;