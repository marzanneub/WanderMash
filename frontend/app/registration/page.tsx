"use client";
import React from "react";
import RegistrationForm from "@/components/forms/registration-form";

const RegistrationPage: React.FC = () => {

    return (
        <div className="bg-gray-50 flex items-center justify-center min-h-screen font-sans">
            <RegistrationForm />
        </div>
    )
}

export default RegistrationPage;