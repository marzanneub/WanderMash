"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { TbChevronLeft } from "react-icons/tb";
import CarouselSkeleton from "@/components/ui/carousel-skeleton";
import Carousel from "@/components/ui/carousel";
import InfoGrid from "@/components/data-display/info-grid";
import InfoGridSkeleton from "@/components/data-display/info-grid-skeleton";
import DescriptionGrid from "@/components/data-display/description-grid";
import DescriptionGridSkeleton from "@/components/data-display/description-grid-skeleton";
import SocialLinksGrid from "@/components/data-display/social-links-grid";
import SocialLinksGridSkeleton from "@/components/data-display/social-links-grid-skeleton";
import ServicesGrid from "@/components/data-display/hotel-services-grid";
import ServicesGridSkeleton from "@/components/data-display/services-grid-skeleton";
import CuisinesGrid from "@/components/data-display/cuisines-grid";
import CuisinesGridSkeleton from "@/components/data-display/cuisines-grid-skeleton";
import MapViewSkeleton from "@/components/maps/map-view-skeleton";
import MapView from "@/components/maps/map-view";

interface SocialLinks {
    facebook: string;
    instagram: string;
    twitter: string;
}

interface Location {
    latitude: number|null;
    longitude: number|null;
}

interface Policies {
    checkIn: string;
    checkOut: string;
    cancellation: string;
}

interface Hotel {
    name: string;
    logo: string;
    images: string[];
    email: string;
    registrationId: string;
    phone: string;
    approved: boolean;
    address: string;
    district: string;
    area: string;
    postalCode: number;
    description: string;
    socialLinks?: SocialLinks;
    facilities?: string[];
    views?: string[];
    policies: Policies;
    location: Location;
}

const HotePreviewPage: React.FC = () => {
    const router = useRouter();
    const [role, setRole] = useState("");
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [loading, setLoading] = useState(true);

    const searchParams = useSearchParams();
    const id  = searchParams.get("id");
    const warnmessage  = searchParams.get("warnmessage");
    const successmessage  = searchParams.get("successmessage");

    useEffect(() => {
        toast.warn(warnmessage, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",            
        });
        toast.success(successmessage, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
        fetch(`/api/get-hotel-info?id=${id}`) 
            .then(res => res.json())
            .then(data => {
                setHotel(data.hotel);
                setLoading(false);
            }
        );

        fetch('/api/get-user-info-for-navbar') 
            .then(res => res.json())
            .then(data => {
                setRole(data.role);
            }
        );
    }, []);

/////////////////////////////////////////////
    const contactInformation = [
        { label: "Email", value: hotel?.email },
        { label: "Phone Number", value: hotel?.phone },
    ];

    const location = [
        { label: "Address", value: hotel?.address },
        { label: "District", value: hotel?.district },
        { label: "Area", value: hotel?.area },
        { label: "Postal Code", value: hotel?.postalCode },
    ];

    const policies = [
        { label: "CheckIn", value: hotel?.policies.checkIn },
        { label: "CheckOut", value: hotel?.policies.checkOut },
        { label: "Cancellation", value: hotel?.policies.cancellation },
    ];
/////////////////////////////////////////////

    return (
        <div className="bg-indigo-50 min-h-screen w-full flex">
            <main className="container mx-auto px-10 py-16 max-w-7xl">
            {loading && (
                <div>
                    <div className="h-10 w-72 bg-gray-200 rounded-md mb-10 animate-pulse" />
                    <div className="bg-white rounded-2xl shadow-xl p-12 flex flex-col md:flex-row gap-14">
                        <div className="md:w-2/2 space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-10">
                                <CarouselSkeleton />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-1">
                                <DescriptionGridSkeleton />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                <CuisinesGridSkeleton />
                                <ServicesGridSkeleton />
                                <InfoGridSkeleton />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                <SocialLinksGridSkeleton />
                                <InfoGridSkeleton />
                                <InfoGridSkeleton />
                            </div>
                            <div>
                                <MapViewSkeleton />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {hotel!==null && (
                <div>
                    <div className="flex items-center gap-4 mb-10">
                    <button onClick={() => router.back()}
                        className="p-2 bg-white rounded-full shadow-sm text-gray-300 hover:bg-gray-100 hover:text-black transition flex-shrink-0 cursor-pointer">
                        <TbChevronLeft size={24} />
                    </button>
                    <h1 className="text-4xl font-bold text-indigo-900">{hotel.name}</h1>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-12 flex flex-col md:flex-row gap-14">
                        <div className="md:w-2/2 space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-10">
                                {hotel.images.length>0 && (<Carousel items={hotel.images} />)}
                            </div>
                            {role === "generalUser" && (
                                <div className="grid grid-cols-1 sm:grid-cols-6">
                                    <Link href={`/generalUser/bookHotel?_id=${id}`}>
                                    <button
                                    className="w-full bg-indigo-600 flex items-center justify-center text-white font-semibold py-3 rounded-md disabled:opacity-70 cursor-pointer"
                                    >Book now
                                    </button>
                                    </Link>
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-1">
                                <DescriptionGrid description={hotel.description} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                <CuisinesGrid title="Views" items={hotel.views || []} />
                                <ServicesGrid title="Facilities & Services" items={hotel.facilities || []} />
                                <InfoGrid title="Policies" items={policies} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                <SocialLinksGrid {...hotel.socialLinks}/>
                                <InfoGrid title="Contact Information" items={contactInformation} />
                                <InfoGrid title="Location" items={location} />
                            </div>
                            {(hotel.location.latitude && hotel.location.longitude) && (
                                <MapView 
                                    latitude={hotel.location.latitude} 
                                    longitude={hotel.location.longitude} 
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
            </main>
        </div>
    )
}

export default HotePreviewPage;