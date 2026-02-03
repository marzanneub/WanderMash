"use client"
import React from "react";

const Hero: React.FC = () => {
    return(
        <div>
            <section className="relative bg-cover bg-center bg-no-repeat text-white py-24 text-center shadow-xl" style={{ backgroundImage: "url('/images/website/cover_photo_2.png')" }}>

                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>

                <div className="relative container mx-auto px-6 max-w-4xl">
                <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">Plan Your Perfect Trip</h1>
                <p className="text-xl md:text-2xl mb-10 drop-shadow-md">Hotels, attractions, restaurants – all in one place</p>
                
                </div>
            </section>
        </div>
    )
}

export default Hero;




// url => previous project