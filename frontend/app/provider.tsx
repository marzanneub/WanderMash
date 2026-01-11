"use client";
import { useState, useEffect } from 'react';
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";

interface ProviderProps {
    children: React.ReactNode;
    pagetype?: string;
    showNavbar?: boolean;
    showFooter?: boolean;
}

export default function Provider({ children, pagetype, showNavbar, showFooter }: ProviderProps) {
    const [role, setRole] = useState("");
    const [dp, setDp] = useState("");


    useEffect(() => {
        fetch('/api/get-user-info-for-navbar') 
            .then(res => res.json())
            .then(data => {
                setRole(data.role);
                setDp(data.dp);
            }
        );
    }, []);

    return (
        <>
            {showNavbar && <Navbar pagetype={pagetype} role={role} dp={dp}  />}
                <main>{children}</main>
            {showFooter && <Footer />}
        </>
    );
}