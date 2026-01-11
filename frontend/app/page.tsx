"use client"
import React, { useState, useEffect } from 'react';
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import Hero from "@/components/layout/hero";
import PopularHotels from "@/components/layout/popular-hotels";
import MustSeeAttractions from "@/components/layout/must-see-attractions";
import TopRestaurants from "@/components/layout/top-restaurants";

const IndexPage: React.FC = () => {
    const [role, setRole] = useState("");
    const [dp, setDp] = useState("");

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
        <div>
            <Navbar pagetype="Home" role={role} dp={dp}  />
            <Hero />

            <MustSeeAttractions />
            <TopRestaurants />
            <PopularHotels />

            <Footer/>
        </div>
    )
}

export default IndexPage;