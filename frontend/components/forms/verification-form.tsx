"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

const VerificationForm: React.FC = () => {
    const router = useRouter();
    const [code, setCode] = useState("");
    // const [message, setMessage] = useState(false);

    const searchParams = useSearchParams();
    const message = searchParams.get("message");
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
        errormessage?: string;
    }>({});

    const time = 30;
    const [countdown, setCountdown] = useState(time);
    const [canResend, setCanResend] = useState(false);

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
        const res = await fetch("http://localhost:4000/auth/resend-verification-code", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            // body: JSON.stringify({null}),
            credentials: "include",
        });

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

        setErrors(newErrors);

        if (Object.keys(newErrors).length !== 0) return;

        const res = await fetch("http://localhost:4000/auth/verification", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
            credentials: "include",
        });

        if(!res.ok){
            const data = await res.json();
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
        
        router.push("/login?message=Verification successful");
    };
    
    return (
        <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-8">
            <h2 className="text-3xl font-extrabold text-indigo-900 mb-6 text-center">Verify Your Email</h2>

            <p className="text-gray-600 text-center mb-8">
                Please enter the code we sent to your email address.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
                    <input
                    type="text"
                    id="code"
                    name="code"
                    placeholder="e.g., 325471"
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.code && (
                        <p className="mt-1 text-sm text-red-600">{errors.code}</p>
                    )}
                </div>
                <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md shadow-md transition cursor-pointer"
                >
                    Verify
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

export default VerificationForm;