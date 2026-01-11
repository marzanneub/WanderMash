import React from "react";
import PasswordRecoveryForm from "@/components/forms/password-recovery-form";

const ForgotPasswordPage: React.FC = () => {

    return (
        <div className="bg-gray-50 flex items-center justify-center min-h-screen font-sans">
            <PasswordRecoveryForm />
        </div>
    )
}

export default ForgotPasswordPage;