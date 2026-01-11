import React from "react";
import LoginForm from "@/components/forms/login-form";

const LoginPage: React.FC = () => {

    return (
        <div className="bg-gray-50 flex items-center justify-center min-h-screen font-sans">
            <LoginForm />
        </div>
    )
}

export default LoginPage;